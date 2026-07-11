import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { sendAdminQuoteEmail, sendCustomerQuoteThankYouEmail } from "../../../lib/emails";

// Helper to convert base64 data URI to standard Buffer
function base64ToBuffer(base64DataUri: string): { buffer: Buffer; mimeType: string; extension: string } {
  const matches = base64DataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string layout.");
  }
  const mimeType = matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const extension = mimeType.split("/")[1] || "bin";
  return { buffer, mimeType, extension };
}

// Generate unique Quote ID
function generateQuoteId(): string {
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const year = new Date().getFullYear();
  return `RF-${year}-${randomStr}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      company,
      phone,
      whatsapp,
      email,
      city,
      state,
      country = "India",
      productOfInterest,
      quantity = 1,
      glassSize,
      screenSize,
      budgetRange,
      timeline,
      specialRequirements,
      drawingData, // Base64
      drawingName,
      imageData, // Base64
      imageName,
    } = body;

    // Server-side validations
    if (!fullName || !phone || !whatsapp || !email || !city || !state || !glassSize) {
      return NextResponse.json(
        { error: "Missing required spec fields for quote calculation." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const quoteId = generateQuoteId();

    let drawingUrl = "";
    let imageUrl = "";

    // 1. Process Drawing Attachment if present
    if (drawingData && drawingName) {
      try {
        const { buffer, mimeType, extension } = base64ToBuffer(drawingData);
        const fileName = `${quoteId}-drawing-${Date.now()}.${extension}`;
        
        // Upload to drawings bucket
        const { error: uploadError } = await supabaseAdmin.storage
          .from("drawings")
          .upload(fileName, buffer, {
            contentType: mimeType,
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Retrieve public URL (if public) or private signed URL. 
        // Here we store public url for ease of download, or link.
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("drawings")
          .getPublicUrl(fileName);

        drawingUrl = publicUrlData?.publicUrl || "";
      } catch (fileErr) {
        console.error("Failed to upload drawing file:", fileErr);
      }
    }

    // 2. Process Facade Image Attachment if present
    if (imageData && imageName) {
      try {
        const { buffer, mimeType, extension } = base64ToBuffer(imageData);
        const fileName = `${quoteId}-site-${Date.now()}.${extension}`;
        
        const { error: uploadError } = await supabaseAdmin.storage
          .from("uploads")
          .upload(fileName, buffer, {
            contentType: mimeType,
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseAdmin.storage
          .from("uploads")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData?.publicUrl || "";
      } catch (fileErr) {
        console.error("Failed to upload site photo:", fileErr);
      }
    }

    // 3. Save into Supabase Database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("quote_requests")
      .insert([
        {
          quote_id: quoteId,
          full_name: fullName,
          company,
          phone,
          whatsapp,
          email,
          city,
          state,
          country,
          product_of_interest: productOfInterest,
          quantity: parseInt(String(quantity), 10) || 1,
          glass_size: glassSize,
          screen_size: screenSize,
          budget_range: budgetRange,
          timeline,
          special_requirements: specialRequirements,
          drawing_url: drawingUrl,
          image_url: imageUrl,
          status: "Pending",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database Save Quote Error:", dbError);
      return NextResponse.json(
        { error: "Failed to persist quote details in database." },
        { status: 500 }
      );
    }

    // 4. Send Transactional Emails
    try {
      await Promise.all([
        sendAdminQuoteEmail({
          quoteId,
          fullName,
          company,
          phone,
          whatsapp,
          email,
          city,
          state,
          productOfInterest,
          quantity: String(quantity),
          glassSize,
          screenSize,
          budgetRange,
          timeline,
          specialRequirements,
          drawingUrl,
          imageUrl,
        }),
        sendCustomerQuoteThankYouEmail({
          email,
          fullName,
          quoteId,
          productOfInterest,
        }),
      ]);
    } catch (emailErr) {
      console.error("Fired mail failed:", emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting Reefilm India. Our sales team will contact you shortly.",
        quoteId,
        data: dbData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Quote Endpoint Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
