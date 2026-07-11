import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "leads-db.json");
const ADMIN_DB_FILE = path.join(process.cwd(), "admin-db.json");

// Define type schemas for secure administrative storage
interface ServerAdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string; // SHA-256
  role: "Administrator" | "Editor";
  createdAt: string;
}

interface ServerLoginHistory {
  id: string;
  email: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  status: "success" | "failed";
  reason?: string;
}

interface AdminDbSchema {
  users: ServerAdminUser[];
  loginHistory: ServerLoginHistory[];
}

// Bootstrap local persistent Admin database if not found
function initAdminDatabase() {
  if (!fs.existsSync(ADMIN_DB_FILE)) {
    const initialDb: AdminDbSchema = {
      users: [
        {
          id: "admin-1",
          username: "admin",
          email: "razzg946@gmail.com",
          // e6c5689379659b922718471c26f041ff9cf7f29c9cc747ee7be0a68d875704d9 is the secure hash of "ReefilmIndia2026!"
          passwordHash: "e6c5689379659b922718471c26f041ff9cf7f29c9cc747ee7be0a68d875704d9",
          role: "Administrator",
          createdAt: new Date().toISOString()
        }
      ],
      loginHistory: [
        {
          id: "lh-init",
          email: "razzg946@gmail.com",
          timestamp: new Date().toISOString(),
          ip: "127.0.0.1",
          userAgent: "System Init",
          status: "success"
        }
      ]
    };
    fs.writeFileSync(ADMIN_DB_FILE, JSON.stringify(initialDb, null, 2), "utf8");
    console.log("[Reefilm CMS] Enterprise admin database initialized successfully at " + ADMIN_DB_FILE);
  }
}

initAdminDatabase();

function readAdminDb(): AdminDbSchema {
  try {
    if (fs.existsSync(ADMIN_DB_FILE)) {
      const data = fs.readFileSync(ADMIN_DB_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading admin database:", error);
  }
  return { users: [], loginHistory: [] };
}

function writeAdminDb(db: AdminDbSchema) {
  try {
    fs.writeFileSync(ADMIN_DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing admin database:", error);
  }
}

// Security in-memory storage maps (resilient & thread-safe)
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number; verified: boolean }>();
const resetTokens = new Map<string, { email: string; expiresAt: number }>();
const activeSessions = new Map<string, { email: string; username: string; role: string; expiresAt: number }>();

// Security verification email sender
async function sendEmail(to: string, subject: string, text: string, html: string) {
  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Reefilm India Desk" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html
      });
      console.log(`[SMTP] Dispatched secure email notification to ${to}`);
      return true;
    } catch (e) {
      console.error("[SMTP] Failed to dispatch via SMTP. Printing to system logs:", e);
    }
  }

  // Simulated email delivery logs for preview/sandbox spaces
  console.log("==================== SECURE EMAIL SYSTEM LOG ====================");
  console.log(`Dispatched to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${text}`);
  console.log("=================================================================");
  return false;
}

// Session Validation Middleware
function requireSession(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized access: Active login session missing." });
  }

  const token = authHeader.split(" ")[1];
  const session = activeSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      activeSessions.delete(token); // Prune expired session
    }
    return res.status(401).json({ success: false, message: "Your login session has expired (30-minute inactivity limit). Please log in again." });
  }

  // Sliding session expiration extension on user activity (30 minutes)
  session.expiresAt = Date.now() + 30 * 60 * 1000;
  req.session = session;
  next();
}

// Middleware to parse payload with larger size support for base64 file attachments
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Initialize persistent database
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialLeads = [
      {
        id: "lead-1",
        fullName: "Aravind Swami",
        email: "aravind@lntrealty.com",
        phone: "+91 99887 76655",
        company: "L&T Realty",
        role: "Senior Project Manager",
        productOfInterest: "Transparent LED Film (Adhesive)",
        pixelPitchPreference: "6.25mm",
        glassSize: "12m x 4m (48 sq. meters)",
        projectLocation: "Seawoods, Navi Mumbai",
        timeline: "Next 3 Months",
        budgetRange: "₹35L - ₹50L",
        specialRequirements: "Requires integration into double-height glass lobby, structural stability certificate for coastal winds.",
        status: "Proposal Sent",
        createdAt: "2026-06-25T11:20:00.000Z"
      },
      {
        id: "lead-2",
        fullName: "Sonia Dhillon",
        email: "sonia@bbdesign.co.in",
        phone: "+91 91234 56789",
        company: "B&B Architecture & Design",
        role: "Chief Interior Designer",
        productOfInterest: "Flexible LED Film (Curved Surfaces)",
        pixelPitchPreference: "5.0mm",
        glassSize: "3m Circumference Columns",
        projectLocation: "Aerocity, New Delhi",
        timeline: "Immediate (Within 30 Days)",
        budgetRange: "₹15L - ₹25L",
        specialRequirements: "Wrapping four load-bearing columns inside a premium hotel reception area.",
        status: "New",
        createdAt: "2026-06-26T16:45:00.000Z"
      }
    ];
    fs.writeFileSync(DB_FILE, JSON.stringify(initialLeads, null, 2), "utf8");
    console.log("Database initialized successfully at " + DB_FILE);
  }
}

initDatabase();

// Read all leads from local DB
function readLeads() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  return [];
}

// Write leads to local DB
function writeLeads(leads: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Configure professional nodemailer email client
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });
  }
  return null;
}

// --- API ROUTES ---

// Endpoint for logging client-side errors
app.post("/api/log-error", (req, res) => {
  const { message, source, lineno, colno, error, stack, href } = req.body;
  const logMessage = `
[${new Date().toISOString()}] CLIENT EXCEPTION:
URL: ${href}
Message: ${message}
Source: ${source} (Line: ${lineno}, Col: ${colno})
Stack: ${stack || (error && error.stack) || "No stack trace available"}
--------------------------------------------------\n`;
  try {
    fs.appendFileSync(path.join(process.cwd(), "client-errors.log"), logMessage, "utf8");
  } catch (e) {
    console.error("Failed to write to client-errors.log file", e);
  }

  console.error("=== CLIENT-SIDE RUNTIME EXCEPTION ===");
  console.error(`URL: ${href}`);
  console.error(`Message: ${message}`);
  console.error(`Source: ${source} (Line: ${lineno}, Col: ${colno})`);
  console.error(`Stack: ${stack || (error && error.stack) || "No stack trace available"}`);
  console.error("=====================================");
  res.json({ logged: true });
});

// Submit a new inquiry (Quote or Contact form)
app.post("/api/leads", async (req, res) => {
  try {
    const payload = req.body;
    const leads = readLeads();

    const newLead = {
      id: `lead-${Date.now()}`,
      fullName: payload.fullName || payload.name || "Inquirer",
      email: payload.email || "",
      phone: payload.phone || "",
      whatsapp: payload.whatsapp || payload.phone || "",
      company: payload.company || "",
      role: payload.role || "",
      productOfInterest: payload.productOfInterest || payload.product || "General Query",
      pixelPitchPreference: payload.pixelPitchPreference || "",
      glassSize: payload.glassSize || "",
      screenSize: payload.screenSize || "",
      quantity: payload.quantity || "",
      budgetRange: payload.budgetRange || payload.budget || "",
      timeline: payload.timeline || "",
      specialRequirements: payload.specialRequirements || payload.message || "",
      city: payload.city || "",
      state: payload.state || "",
      country: payload.country || "India",
      attachmentName: payload.attachmentName || "",
      attachmentData: payload.attachmentData || "", // base64 string
      status: "New",
      createdAt: new Date().toISOString()
    };

    leads.unshift(newLead);
    writeLeads(leads);

    // Prepare notifications
    const transporter = getTransporter();
    
    // Email 1: Notification to Raj Gupta (razzg946@gmail.com)
    const adminMailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0c0c0e; color: #f3f4f6; padding: 40px 20px; max-width: 650px; margin: 0 auto; border-radius: 12px; border: 1px solid #27272a;">
        <div style="text-align: center; border-bottom: 2px solid #e30613; padding-bottom: 20px; margin-bottom: 30px;">
          <h2 style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;">REEFILM INDIA</h2>
          <p style="color: #a1a1aa; font-size: 11px; font-weight: bold; font-family: monospace; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">Lead Dispatch Desk</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #e30613; font-size: 16px; margin-top: 0; text-transform: uppercase; letter-spacing: 0.5px;">New Customer Inquiry Received</h3>
          <p style="color: #d1d5db; line-height: 1.6; font-size: 14px;">An inquiry has been captured and successfully registered in the Chennai persistent SQL/NoSQL database. Below are the complete specifications:</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px;">
          <tr style="background-color: #18181b;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa; width: 35%;">Customer Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;">${newLead.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Company Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;">${newLead.company || "Not Specified"}</td>
          </tr>
          <tr style="background-color: #18181b;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Direct Mobile:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;"><a href="tel:${newLead.phone}" style="color: #e30613; text-decoration: none;">${newLead.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">WhatsApp Line:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;"><a href="https://wa.me/${newLead.whatsapp.replace('+', '')}" style="color: #10b981; text-decoration: none;">${newLead.whatsapp}</a></td>
          </tr>
          <tr style="background-color: #18181b;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Email Address:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;"><a href="mailto:${newLead.email}" style="color: #e30613; text-decoration: none;">${newLead.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Location:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;">${newLead.city || "Not Specified"}, ${newLead.state || ""}, ${newLead.country}</td>
          </tr>
          <tr style="background-color: #18181b;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Product Interest:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #e30613; font-weight: bold;">${newLead.productOfInterest}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Required Sizes:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;">Screen: ${newLead.screenSize || "N/A"} | Glass: ${newLead.glassSize || "N/A"}</td>
          </tr>
          <tr style="background-color: #18181b;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Quantity / Budget:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;">Qty: ${newLead.quantity || "1"} | Budget: ${newLead.budgetRange || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Project Timeline:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;">${newLead.timeline || "N/A"}</td>
          </tr>
          <tr style="background-color: #18181b;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #27272a; color: #a1a1aa;">Attachments:</td>
            <td style="padding: 10px; border-bottom: 1px solid #27272a; color: #ffffff;">${newLead.attachmentName ? `📎 ${newLead.attachmentName} (Available in Dashboard)` : "None"}</td>
          </tr>
        </table>

        <div style="background-color: #18181b; padding: 15px; border-left: 3px solid #e30613; margin-bottom: 30px; font-size: 13px; line-height: 1.6;">
          <p style="margin: 0; font-weight: bold; color: #ffffff; margin-bottom: 5px;">Special Customer Requirements / Message:</p>
          <p style="margin: 0; color: #d1d5db; font-style: italic;">"${newLead.specialRequirements || "No additional comments"}"</p>
        </div>

        <div style="border-top: 1px solid #27272a; padding-top: 20px; font-size: 11px; text-align: center; color: #71717a; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;"><strong>REEFILM CHENNAI</strong> • Technical Support & Sales Hub</p>
          <p style="margin: 0 0 15px 0;">Exclusive Authorized Sales and Installation Desk for India</p>
          <p style="margin: 0;">Sent on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Email 2: Thank You confirmation email to client
    const customerMailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #1f2937; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; border-bottom: 2px solid #e30613; padding-bottom: 20px; margin-bottom: 30px;">
          <h2 style="color: #111827; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;">REEFILM INDIA</h2>
          <p style="color: #6b7280; font-size: 10px; font-weight: bold; font-family: monospace; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">Authorized Technical Partner</p>
        </div>

        <div style="margin-bottom: 25px;">
          <p style="font-size: 16px; font-weight: bold; color: #111827;">Hello ${newLead.fullName},</p>
          <p style="line-height: 1.6; font-size: 14px; color: #374151;">Thank you for contacting <strong>Reefilm India</strong>. This email confirms we have successfully logged your technical inquiry for our premium <strong>Transparent LED Displays</strong>.</p>
          <p style="line-height: 1.6; font-size: 14px; color: #374151;">Raj Gupta's project team, stationed at our Chennai headquarters, is currently reviewing your architectural requirements. We will coordinate directly with our global manufacturing office (<strong>Reefilm Head Office – China</strong>) to compile custom pricing, structural drafts, and pixel pitch layouts tailored to your glass dimensions.</p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #f3f4f6; font-size: 13px; margin-bottom: 30px;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #111827;">Summary of Inquiry Saved:</p>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.6;">
            <li><strong>Product Selected:</strong> ${newLead.productOfInterest}</li>
            <li><strong>Intended Location:</strong> ${newLead.city || "Not Specified"}, India</li>
            <li><strong>Inquiry Reference:</strong> ${newLead.id}</li>
          </ul>
        </div>

        <div style="background-color: #fef2f2; border-left: 4px solid #e30613; padding: 15px; border-radius: 4px; font-size: 13px; margin-bottom: 30px; line-height: 1.6;">
          <p style="margin: 0; font-weight: bold; color: #991b1b; margin-bottom: 4px;">Verified Authorized Partnership:</p>
          <p style="margin: 0; color: #7f1d1d;">All Reefilm materials are custom engineered at our world-class manufacturing facility, <strong>Reefilm Head Office – China</strong>. Reefilm India (Chennai office) handles all certified client logistics, site engineering, structural installation, and our full 1-Year Warranty support.</p>
        </div>

        <p style="font-size: 14px; color: #374151; line-height: 1.6; margin-bottom: 30px;">One of our sales consultants will reach out directly on your provided phone number (<strong>${newLead.phone}</strong>) or WhatsApp to guide you through technical pricing shortly.</p>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; font-size: 11px; text-align: center; color: #6b7280; line-height: 1.6;">
          <p style="margin: 0 0 5px 0;"><strong>REEFILM INDIA – CHENNAI OFFICE</strong></p>
          <p style="margin: 0 0 10px 0;">Contact Person: Raj Gupta | Hotline: +91 85779 17327 | Email: razzg946@gmail.com</p>
          <p style="margin: 0;">Manufacturing: Reefilm Head Office – China</p>
        </div>
      </div>
    `;

    // Dispatch emails
    if (transporter) {
      // Send alert to admin
      await transporter.sendMail({
        from: `"${newLead.fullName}" <${process.env.SMTP_USER}>`,
        to: "razzg946@gmail.com",
        subject: `[New Reefilm Lead Inquiry] - ${newLead.fullName} (${newLead.company || "Individual"})`,
        html: adminMailHtml
      });

      // Send thank you to client
      if (newLead.email) {
        await transporter.sendMail({
          from: `"Reefilm India" <${process.env.SMTP_USER}>`,
          to: newLead.email,
          subject: "Thank you for contacting Reefilm India",
          html: customerMailHtml
        });
      }
      console.log(`[SMTP] Success: Dispatched emails for ${newLead.fullName}`);
    } else {
      // Fallback: beautiful logging if SMTP is not configured
      console.log("==========================================================================");
      console.log(`[EMAIL SIMULATION] (SMTP not configured. Define SMTP_HOST to send real emails)`);
      console.log(`To: razzg946@gmail.com`);
      console.log(`From: notification-desk@reefilm.in`);
      console.log(`Subject: [New Reefilm Lead Inquiry] - ${newLead.fullName}`);
      console.log(`--- [BODY] ---`);
      console.log(`Lead ID: ${newLead.id}`);
      console.log(`Customer: ${newLead.fullName} | Email: ${newLead.email} | Phone: ${newLead.phone} | WhatsApp: ${newLead.whatsapp}`);
      console.log(`Company: ${newLead.company} | Location: ${newLead.city}, ${newLead.state}, ${newLead.country}`);
      console.log(`Product: ${newLead.productOfInterest} | Screen Size: ${newLead.screenSize} | Glass Size: ${newLead.glassSize}`);
      console.log(`Quantity: ${newLead.quantity} | Budget: ${newLead.budgetRange} | Timeline: ${newLead.timeline}`);
      console.log(`Message: "${newLead.specialRequirements}"`);
      if (newLead.attachmentName) {
        console.log(`Attachment: ${newLead.attachmentName} (${Math.round(newLead.attachmentData.length / 1024)} KB encoded)`);
      }
      console.log("--------------------------------------------------------------------------");
      console.log(`To Customer: ${newLead.email}`);
      console.log(`Subject: Thank you for contacting Reefilm India`);
      console.log(`Message: Thank you ${newLead.fullName}, Raj Gupta's Chennai Desk has logged your query!`);
      console.log("==========================================================================");
    }

    return res.status(201).json({
      success: true,
      message: "Thank you for contacting Reefilm India. Our sales team will contact you shortly.",
      lead: newLead
    });

  } catch (error: any) {
    console.error("Error saving lead inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error occurred during database save operation. Please try again."
    });
  }
});

// --- ADMINISTRATIVE AUTHENTICATION API ENDPOINTS ---

// 1. Session Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const now = Date.now();

  // Brute-force block check (locked for 15 mins after 5 failures)
  const attempts = loginAttempts.get(cleanEmail);
  if (attempts && attempts.lockedUntil > now) {
    const minutesLeft = Math.ceil((attempts.lockedUntil - now) / 60000);
    return res.status(423).json({
      success: false,
      message: `Portal temporarily locked due to consecutive authentication failures. Try again in ${minutesLeft} minute(s).`
    });
  }

  const db = readAdminDb();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  const ip = String(req.ip || req.headers["x-forwarded-for"] || "127.0.0.1");
  const userAgent = String(req.headers["user-agent"] || "unknown");

  // Secure SHA-256 Hashing of password input
  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

  if (!user || user.passwordHash !== passwordHash) {
    let currentAttempts = 1;
    let lockedUntil = 0;

    if (attempts) {
      currentAttempts = attempts.count + 1;
      if (currentAttempts >= 5) {
        lockedUntil = now + 15 * 60 * 1000; // 15 mins penalty lock
      }
    }
    loginAttempts.set(cleanEmail, { count: currentAttempts, lockedUntil });

    db.loginHistory.push({
      id: `lh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      timestamp: new Date().toISOString(),
      ip,
      userAgent,
      status: "failed",
      reason: !user ? "Email is not associated with any authorized operator account." : "Incorrect password."
    });
    writeAdminDb(db);

    const left = 5 - currentAttempts;
    const message = left <= 0
      ? "Authentication portal locked for 15 minutes due to excessive login failures."
      : `Invalid administrative credentials. Attempt ${currentAttempts} of 5.`;

    return res.status(401).json({ success: false, message });
  }

  // Clear tracking counters on success
  loginAttempts.delete(cleanEmail);

  // Generate a high-entropy 256-bit secure session token
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = now + (30 * 60 * 1000); // 30 minutes active TTL

  activeSessions.set(sessionToken, {
    email: cleanEmail,
    username: user.username,
    role: user.role,
    expiresAt
  });

  db.loginHistory.push({
    id: `lh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: cleanEmail,
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    status: "success"
  });
  writeAdminDb(db);

  return res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    },
    session: {
      email: user.email,
      token: sessionToken,
      expiresAt
    }
  });
});

// 2. Forgot Password Request (OTP)
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Registered operator email address is mandatory." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const db = readAdminDb();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({ success: false, message: "The email address specified is not registered with an authorized operator." });
  }

  // Generate a random 6-digit verification code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5-minute window

  otpStore.set(cleanEmail, {
    code: otp,
    expiresAt,
    attempts: 0,
    verified: false
  });

  // Compose security email layout
  const subject = "🔒 [Reefilm CMS] Administrative Security Access Code";
  const text = `Your secure administrative OTP verification code is: ${otp}. It expires in 5 minutes. Do not share this code.`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0c0c0e; color: #f3f4f6; padding: 40px; border-radius: 12px; border: 1px solid #27272a; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #e30613; margin-top: 0; text-transform: uppercase;">Security Verification Code</h2>
      <p style="font-size: 14px; color: #d1d5db; line-height: 1.5;">You requested an administrative password reset. Please use the secure verification code (OTP) below to authenticate your identity:</p>
      <div style="background-color: #18181b; border: 1px solid #e30613; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff; margin: 25px 0; border-radius: 8px;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #71717a;">This verification code is valid for exactly 5 minutes and supports a maximum of 5 attempts. If you did not make this request, please contact technical security immediately.</p>
    </div>
  `;

  await sendEmail(user.email, subject, text, html);

  return res.json({ success: true, message: "A secure verification code has been dispatched to your email address." });
});

// 3. Verify OTP
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: "Email and verification code are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const activeOtp = otpStore.get(cleanEmail);

  if (!activeOtp) {
    return res.status(400).json({ success: false, message: "No active verification requests found. Please trigger a new OTP." });
  }

  if (Date.now() > activeOtp.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ success: false, message: "Verification code expired (5-minute limit exceeded). Request a new code." });
  }

  if (activeOtp.attempts >= 5) {
    return res.status(400).json({ success: false, message: "Too many failed attempts. Verification locked. Trigger a new OTP." });
  }

  if (activeOtp.code !== otp.trim()) {
    activeOtp.attempts += 1;
    if (activeOtp.attempts >= 5) {
      return res.status(400).json({ success: false, message: "Too many incorrect attempts. Verification locked. Please request a new OTP." });
    }
    return res.status(400).json({ success: false, message: `Invalid verification code. Attempt ${activeOtp.attempts} of 5.` });
  }

  activeOtp.verified = true;
  // Generate a random high-entropy token to grant secure entry to reset page
  const resetToken = crypto.randomBytes(32).toString("hex");
  resetTokens.set(resetToken, {
    email: cleanEmail,
    expiresAt: Date.now() + 10 * 60 * 1000 // valid for 10 mins
  });

  return res.json({
    success: true,
    resetToken,
    message: "Security code verified successfully. Proceed to reset your password."
  });
});

// 4. Reset Password
app.post("/api/auth/reset-password", (req, res) => {
  const { email, resetToken, newPassword, confirmPassword } = req.body;
  if (!email || !resetToken || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All parameters are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const tokenData = resetTokens.get(resetToken);

  if (!tokenData || tokenData.email !== cleanEmail || Date.now() > tokenData.expiresAt) {
    return res.status(401).json({ success: false, message: "Invalid or expired password reset session." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  const db = readAdminDb();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === cleanEmail);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Operator not found." });
  }

  // Hash new password securely
  const newHash = crypto.createHash("sha256").update(newPassword).digest("hex");
  db.users[userIndex].passwordHash = newHash;
  writeAdminDb(db);

  // Revoke active sessions & reset tokens for this user
  resetTokens.delete(resetToken);
  otpStore.delete(cleanEmail);

  // Force logs out of all active devices / browsers
  for (const [token, session] of activeSessions.entries()) {
    if (session.email === cleanEmail) {
      activeSessions.delete(token);
    }
  }

  return res.json({ success: true, message: "Password updated successfully." });
});

// 5. Trigger Change Password OTP (In-Session)
app.post("/api/auth/send-change-otp", requireSession, async (req: any, res) => {
  const cleanEmail = req.session.email;
  const db = readAdminDb();
  const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({ success: false, message: "Operator session unresolved." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(cleanEmail, {
    code: otp,
    expiresAt,
    attempts: 0,
    verified: false
  });

  const subject = "🔒 [Reefilm CMS] Confirm Password Modification";
  const text = `You are requesting to change your Reefilm India administrative password. Enter OTP code: ${otp} (Valid for 5 mins).`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0c0c0e; color: #f3f4f6; padding: 40px; border-radius: 12px; border: 1px solid #27272a; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #e30613; margin-top: 0; text-transform: uppercase;">Confirm Password Change</h2>
      <p style="font-size: 14px; color: #d1d5db; line-height: 1.5;">You initiated a password modification inside the operator profile page. Please use the secure verification code (OTP) below to authorize this update:</p>
      <div style="background-color: #18181b; border: 1px solid #e30613; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ffffff; margin: 25px 0; border-radius: 8px;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #71717a;">This verification code is valid for exactly 5 minutes and supports a maximum of 5 attempts. If you did not make this request, please change your login credentials immediately.</p>
    </div>
  `;

  await sendEmail(user.email, subject, text, html);

  return res.json({ success: true, message: "A secure verification code has been dispatched to your email address." });
});

// 6. Verify and Execute Change Password (In-Session)
app.post("/api/auth/verify-change-otp", requireSession, (req: any, res) => {
  const { otp, currentPassword, newPassword, confirmPassword } = req.body;
  const cleanEmail = req.session.email;

  if (!otp || !currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All parameters are required." });
  }

  const activeOtp = otpStore.get(cleanEmail);
  if (!activeOtp) {
    return res.status(400).json({ success: false, message: "No active verification requests found. Please initiate a new password change request." });
  }

  if (Date.now() > activeOtp.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ success: false, message: "Verification code expired. Please request a new code." });
  }

  if (activeOtp.attempts >= 5) {
    return res.status(400).json({ success: false, message: "Verification locked due to excessive code failures." });
  }

  if (activeOtp.code !== otp.trim()) {
    activeOtp.attempts += 1;
    if (activeOtp.attempts >= 5) {
      return res.status(400).json({ success: false, message: "Too many incorrect attempts. Verification locked. Please request a new OTP." });
    }
    return res.status(400).json({ success: false, message: `Invalid verification code. Attempt ${activeOtp.attempts} of 5.` });
  }

  const db = readAdminDb();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === cleanEmail);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Operator session unresolved." });
  }

  // Verify current password is correct
  const currentHash = crypto.createHash("sha256").update(currentPassword).digest("hex");
  if (db.users[userIndex].passwordHash !== currentHash) {
    return res.status(400).json({ success: false, message: "The current password entered is incorrect." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Confirm password does not match new password." });
  }

  // Save new password hash
  const newHash = crypto.createHash("sha256").update(newPassword).digest("hex");
  db.users[userIndex].passwordHash = newHash;
  writeAdminDb(db);

  // Clear verification structures
  otpStore.delete(cleanEmail);

  // Revoke active sessions globally (forces re-login)
  for (const [token, session] of activeSessions.entries()) {
    if (session.email === cleanEmail) {
      activeSessions.delete(token);
    }
  }

  return res.json({ success: true, message: "Password updated successfully. Session revoked globally for safety." });
});

// 7. Get Login Audit Log history
app.get("/api/auth/login-history", requireSession, (req, res) => {
  const db = readAdminDb();
  return res.json(db.loginHistory);
});

// 8. Fetch authorized operator users list
app.get("/api/auth/users", requireSession, (req, res) => {
  const db = readAdminDb();
  const sanitized = db.users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    passwordHash: u.passwordHash
  }));
  return res.json(sanitized);
});

// 9. Register a new operator user
app.post("/api/auth/users", requireSession, (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const db = readAdminDb();
  if (db.users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return res.status(400).json({ success: false, message: "This email address is already registered." });
  }

  const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
  const newUser: ServerAdminUser = {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    username: username.trim(),
    email: cleanEmail,
    passwordHash,
    role,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeAdminDb(db);

  return res.status(201).json({ success: true, user: newUser });
});

// 10. Revoke operator permissions
app.delete("/api/auth/users/:id", requireSession, (req: any, res) => {
  const { id } = req.params;
  const db = readAdminDb();

  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: "Operator not found." });
  }

  if (user.email.toLowerCase() === req.session.email.toLowerCase()) {
    return res.status(400).json({ success: false, message: "Self-revocation is strictly forbidden." });
  }

  db.users = db.users.filter(u => u.id !== id);
  writeAdminDb(db);

  // Revoke any active sessions for the removed operator
  for (const [token, session] of activeSessions.entries()) {
    if (session.email.toLowerCase() === user.email.toLowerCase()) {
      activeSessions.delete(token);
    }
  }

  return res.json({ success: true, message: "Operator access permissions revoked successfully." });
});

// --- PROTECTED CMS INQUIRY (LEADS) ENDPOINTS ---

// Fetch all leads (Requires active operational session)
app.get("/api/leads", requireSession, (req, res) => {
  try {
    const leads = readLeads();
    return res.json(leads);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching database leads" });
  }
});

// Update lead status (Requires active operational session)
app.put("/api/leads/:id", requireSession, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let leads = readLeads();

    let leadUpdated = false;
    leads = leads.map((lead: any) => {
      if (lead.id === id) {
        leadUpdated = true;
        return { ...lead, status };
      }
      return lead;
    });

    if (!leadUpdated) {
      return res.status(404).json({ success: false, message: "Lead inquiry not found" });
    }

    writeLeads(leads);
    return res.json({ success: true, message: "Lead status updated successfully", leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating lead status" });
  }
});

// Delete lead (Requires active operational session)
app.delete("/api/leads/:id", requireSession, (req, res) => {
  try {
    const { id } = req.params;
    const leads = readLeads();
    const filteredLeads = leads.filter((lead: any) => lead.id !== id);

    if (leads.length === filteredLeads.length) {
      return res.status(404).json({ success: false, message: "Lead inquiry not found" });
    }

    writeLeads(filteredLeads);
    return res.json({ success: true, message: "Lead inquiry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting lead inquiry" });
  }
});

// --- VITE DEV/PROD MIDDLEWARE HANDLER ---

async function startServer() {
  const serveStaticAssets = () => {
    app.use("/src/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));
    app.use("/assets/images", express.static(path.join(process.cwd(), "src/assets/images")));
    app.use("/src/assets", express.static(path.join(process.cwd(), "src/assets")));
    app.use("/assets", express.static(path.join(process.cwd(), "src/assets")));
  };

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    // Serve static assets as a fallback after Vite processes import modules
    serveStaticAssets();
  } else {
    serveStaticAssets();
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Reefilm Server] Running locally on port ${PORT}`);
  });
}

startServer();
