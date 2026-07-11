import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { sendAdminContactEmail, sendCustomerThankYouEmail } from "../../../lib/emails";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { fullName, company, phone, whatsapp, email, city, message } = body;

    // Strict validation
    if (!fullName || !phone || !whatsapp || !email || !city) {
      return NextResponse.json(
        { error: "Missing required fields (fullName, phone, whatsapp, email, city)." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 1. Save to Supabase SQL Database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("contacts")
      .insert([
        {
          full_name: fullName,
          company,
          phone,
          whatsapp,
          email,
          city,
          message,
          status: "Pending",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      return NextResponse.json(
        { error: "Database error. Failed to record inquiry." },
        { status: 500 }
      );
    }

    // 2. Dispatch Emails in Parallel using Resend
    try {
      await Promise.all([
        sendAdminContactEmail({
          fullName,
          company,
          phone,
          whatsapp,
          email,
          city,
          message,
        }),
        sendCustomerThankYouEmail(email, fullName),
      ]);
    } catch (emailError) {
      // Log error but do not fail request since DB insert succeeded
      console.error("Resend Dispatch Error:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting Reefilm India. Our sales team will contact you shortly.",
        data: dbData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
