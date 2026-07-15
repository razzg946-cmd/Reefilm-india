import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import pg from "pg";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "leads-db.json");
const ADMIN_DB_FILE = path.join(process.cwd(), "admin-db.json");

// Helper to initialize and retrieve Supabase client safely
function getSupabaseClient() {
  const url = (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");
  const isPlaceholder = url.includes("your-") || url.includes("placeholder") || key.includes("your-") || key.includes("placeholder");
  
  if (url && key && isValidUrl && !isPlaceholder) {
    try {
      return createClient(url, key);
    } catch (e) {
      console.error("Failed to initialize Supabase client in server:", e);
    }
  }
  return null;
}

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

// --- ADMIN SYSTEM SETUP ENDPOINTS ---

// Helpers for dynamic configuration of .env
function updateEnvFile(updates: Record<string, string>) {
  const envPath = path.join(process.cwd(), ".env");
  let lines: string[] = [];
  if (fs.existsSync(envPath)) {
    lines = fs.readFileSync(envPath, "utf-8").split("\n");
  }
  
  for (const [key, val] of Object.entries(updates)) {
    // Set in-memory environment variable immediately
    process.env[key] = val;
    
    // Set matching aliases
    if (key === "SUPABASE_URL") {
      process.env.VITE_SUPABASE_URL = val;
      process.env.NEXT_PUBLIC_SUPABASE_URL = val;
    }
    if (key === "SUPABASE_ANON_KEY") {
      process.env.VITE_SUPABASE_ANON_KEY = val;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = val;
    }

    let found = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(`${key}=`)) {
        lines[i] = `${key}=${val}`;
        found = true;
        break;
      }
    }
    if (!found) {
      lines.push(`${key}=${val}`);
    }
  }

  // Double check and write VITE_ variants for security & compiler safety
  if (updates.SUPABASE_URL) {
    if (!lines.some(l => l.startsWith("VITE_SUPABASE_URL="))) {
      lines.push(`VITE_SUPABASE_URL=${updates.SUPABASE_URL}`);
    } else {
      lines = lines.map(l => l.startsWith("VITE_SUPABASE_URL=") ? `VITE_SUPABASE_URL=${updates.SUPABASE_URL}` : l);
    }
    if (!lines.some(l => l.startsWith("NEXT_PUBLIC_SUPABASE_URL="))) {
      lines.push(`NEXT_PUBLIC_SUPABASE_URL=${updates.SUPABASE_URL}`);
    } else {
      lines = lines.map(l => l.startsWith("NEXT_PUBLIC_SUPABASE_URL=") ? `NEXT_PUBLIC_SUPABASE_URL=${updates.SUPABASE_URL}` : l);
    }
  }
  if (updates.SUPABASE_ANON_KEY) {
    if (!lines.some(l => l.startsWith("VITE_SUPABASE_ANON_KEY="))) {
      lines.push(`VITE_SUPABASE_ANON_KEY=${updates.SUPABASE_ANON_KEY}`);
    } else {
      lines = lines.map(l => l.startsWith("VITE_SUPABASE_ANON_KEY=") ? `VITE_SUPABASE_ANON_KEY=${updates.SUPABASE_ANON_KEY}` : l);
    }
    if (!lines.some(l => l.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY="))) {
      lines.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${updates.SUPABASE_ANON_KEY}`);
    } else {
      lines = lines.map(l => l.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=") ? `NEXT_PUBLIC_SUPABASE_ANON_KEY=${updates.SUPABASE_ANON_KEY}` : l);
    }
  }

  fs.writeFileSync(envPath, lines.join("\n"), "utf-8");
}

// Get the Admin / Service Role Supabase client
function getSupabaseAdminClient() {
  const url = (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (url && key && url.startsWith("http")) {
    try {
      return createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
    } catch (e) {
      console.error("Failed to initialize Supabase admin client:", e);
    }
  }
  return null;
}

// Raw SQL migration script for all tables
const CMS_MIGRATION_SQL = `
-- 1. Create table 'categories'
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table 'products'
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  tagline TEXT,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}'::jsonb,
  installation TEXT,
  maintenance TEXT,
  image TEXT,
  "brochureUrl" TEXT,
  series TEXT,
  "videoUrl" TEXT,
  "displayOrder" INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table 'product_images'
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create table 'product_documents'
CREATE TABLE IF NOT EXISTS product_documents (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT,
  document_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create table 'gallery'
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  "imageUrl" TEXT,
  image_url TEXT,
  "videoUrl" TEXT,
  location TEXT,
  client TEXT,
  timeline TEXT,
  is_featured BOOLEAN DEFAULT false,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create table 'blogs'
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  "publishedAt" TEXT,
  "readTime" TEXT,
  author TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create table 'downloads'
CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  "fileSize" TEXT,
  "downloadCount" INT DEFAULT 0,
  "fileUrl" TEXT,
  "docCode" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create table 'team_members'
CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  initials TEXT,
  bio TEXT,
  email TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create table 'contact_leads'
CREATE TABLE IF NOT EXISTS contact_leads (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  company TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Create table 'quote_requests'
CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  lead_id TEXT REFERENCES contact_leads(id) ON DELETE SET NULL,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  pixel_pitch TEXT,
  screen_size TEXT,
  quantity INT DEFAULT 1,
  target_budget TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Create table 'website_settings'
CREATE TABLE IF NOT EXISTS website_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Create table 'admin_users'
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  role TEXT DEFAULT 'Editor',
  "createdAt" TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Create table 'media_library'
CREATE TABLE IF NOT EXISTS media_library (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT,
  bucket_name TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Create table 'projects' (backward-compatible)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  client TEXT,
  timeline TEXT,
  description TEXT,
  "techUsed" TEXT[] DEFAULT '{}',
  "beforeImage" TEXT,
  "afterImage" TEXT,
  "installationSize" TEXT,
  "projectHighlights" TEXT[] DEFAULT '{}',
  "customerBenefits" TEXT[] DEFAULT '{}',
  review JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Create table 'testimonials' (backward-compatible)
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT,
  company TEXT,
  text TEXT,
  rating INT DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Create table 'team' (backward-compatible)
CREATE TABLE IF NOT EXISTS team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  initials TEXT,
  bio TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. Create table 'settings' (backward-compatible)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  "companyName" TEXT,
  tagline TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  hours TEXT,
  "logoUrl" TEXT,
  "footerText" TEXT,
  "homeHeroBanner" TEXT,
  "homeHeroHeadline" TEXT,
  "homeHeroSubtitle" TEXT,
  "homeHeroCta1Text" TEXT,
  "homeHeroCta1Tab" TEXT,
  "homeHeroCta2Text" TEXT,
  "homeHeroCta2Tab" TEXT,
  "homeHeroImage" TEXT,
  "homeHeroVideo" TEXT,
  "aboutHeaderTitle" TEXT,
  "aboutHeaderSubtitle" TEXT,
  "aboutHeaderIntro" TEXT,
  "aboutChinaTitle" TEXT,
  "aboutChinaSub" TEXT,
  "aboutChinaText" TEXT,
  "aboutChinaFounder" TEXT,
  "aboutChinaWebsite" TEXT,
  "aboutChinaHeadquarters" TEXT,
  "aboutChinaBusiness" TEXT,
  "aboutTeamTitle" TEXT,
  "aboutTeamSub" TEXT,
  "aboutTeamDesc" TEXT,
  "aboutFactoryTitle" TEXT,
  "aboutFactorySub" TEXT,
  "aboutFactoryDesc1" TEXT,
  "aboutFactoryDesc2" TEXT,
  "aboutServicesTitle" TEXT,
  "aboutServicesSub" TEXT,
  "aboutServicesDesc" TEXT,
  "aboutIndiaTitle" TEXT,
  "aboutIndiaSub" TEXT,
  "aboutIndiaDesc1" TEXT,
  "aboutIndiaDesc2" TEXT,
  "aboutIndiaSLA1" TEXT,
  "aboutIndiaSLA2" TEXT,
  "aboutIndiaSLA3" TEXT,
  "aboutCtaTitle" TEXT,
  "aboutCtaDesc" TEXT,
  "factoryAddress" TEXT,
  "googleMapEmbed" TEXT,
  "facebookUrl" TEXT,
  "linkedinUrl" TEXT,
  "youtubeUrl" TEXT,
  "instagramUrl" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. Create table 'leads' (backward-compatible)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  company TEXT,
  role TEXT,
  "productOfInterest" TEXT,
  "pixelPitchPreference" TEXT,
  "glassSize" TEXT,
  "screenSize" TEXT,
  quantity TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  "projectLocation" TEXT,
  timeline TEXT,
  "budgetRange" TEXT,
  "specialRequirements" TEXT,
  status TEXT DEFAULT 'New',
  "createdAt" TEXT NOT NULL,
  "drawingName" TEXT,
  "drawingData" TEXT,
  "imageName" TEXT,
  "imageData" TEXT,
  "attachmentName" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Auto-update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_product_images_updated_at ON product_images;
CREATE TRIGGER trg_product_images_updated_at BEFORE UPDATE ON product_images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_product_documents_updated_at ON product_documents;
CREATE TRIGGER trg_product_documents_updated_at BEFORE UPDATE ON product_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_gallery_updated_at ON gallery;
CREATE TRIGGER trg_gallery_updated_at BEFORE UPDATE ON gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_blogs_updated_at ON blogs;
CREATE TRIGGER trg_blogs_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_downloads_updated_at ON downloads;
CREATE TRIGGER trg_downloads_updated_at BEFORE UPDATE ON downloads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_team_members_updated_at ON team_members;
CREATE TRIGGER trg_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_contact_leads_updated_at ON contact_leads;
CREATE TRIGGER trg_contact_leads_updated_at BEFORE UPDATE ON contact_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_quote_requests_updated_at ON quote_requests;
CREATE TRIGGER trg_quote_requests_updated_at BEFORE UPDATE ON quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_website_settings_updated_at ON website_settings;
CREATE TRIGGER trg_website_settings_updated_at BEFORE UPDATE ON website_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin_users;
CREATE TRIGGER trg_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_media_library_updated_at ON media_library;
CREATE TRIGGER trg_media_library_updated_at BEFORE UPDATE ON media_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_testimonials_updated_at ON testimonials;
CREATE TRIGGER trg_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_team_updated_at ON team;
CREATE TRIGGER trg_team_updated_at BEFORE UPDATE ON team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_settings_updated_at ON settings;
CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_leads_updated_at ON leads;
CREATE TRIGGER trg_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_documents_product_id ON product_documents(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_lead_id ON quote_requests(lead_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_product_id ON quote_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_media_library_type ON media_library(file_type);

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Permissive policies for standard CMS operations
DROP POLICY IF EXISTS select_categories ON categories;
CREATE POLICY select_categories ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS write_categories ON categories;
CREATE POLICY write_categories ON categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_products ON products;
CREATE POLICY select_products ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS write_products ON products;
CREATE POLICY write_products ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_product_images ON product_images;
CREATE POLICY select_product_images ON product_images FOR SELECT USING (true);
DROP POLICY IF EXISTS write_product_images ON product_images;
CREATE POLICY write_product_images ON product_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_product_documents ON product_documents;
CREATE POLICY select_product_documents ON product_documents FOR SELECT USING (true);
DROP POLICY IF EXISTS write_product_documents ON product_documents;
CREATE POLICY write_product_documents ON product_documents FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_gallery ON gallery;
CREATE POLICY select_gallery ON gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS write_gallery ON gallery;
CREATE POLICY write_gallery ON gallery FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_blogs ON blogs;
CREATE POLICY select_blogs ON blogs FOR SELECT USING (true);
DROP POLICY IF EXISTS write_blogs ON blogs;
CREATE POLICY write_blogs ON blogs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_downloads ON downloads;
CREATE POLICY select_downloads ON downloads FOR SELECT USING (true);
DROP POLICY IF EXISTS write_downloads ON downloads;
CREATE POLICY write_downloads ON downloads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_team_members ON team_members;
CREATE POLICY select_team_members ON team_members FOR SELECT USING (true);
DROP POLICY IF EXISTS write_team_members ON team_members;
CREATE POLICY write_team_members ON team_members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_contact_leads ON contact_leads;
CREATE POLICY select_contact_leads ON contact_leads FOR SELECT USING (true);
DROP POLICY IF EXISTS write_contact_leads ON contact_leads;
CREATE POLICY write_contact_leads ON contact_leads FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_quote_requests ON quote_requests;
CREATE POLICY select_quote_requests ON quote_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS write_quote_requests ON quote_requests;
CREATE POLICY write_quote_requests ON quote_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_website_settings ON website_settings;
CREATE POLICY select_website_settings ON website_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS write_website_settings ON website_settings;
CREATE POLICY write_website_settings ON website_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_admin_users ON admin_users;
CREATE POLICY select_admin_users ON admin_users FOR SELECT USING (true);
DROP POLICY IF EXISTS write_admin_users ON admin_users;
CREATE POLICY write_admin_users ON admin_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_media_library ON media_library;
CREATE POLICY select_media_library ON media_library FOR SELECT USING (true);
DROP POLICY IF EXISTS write_media_library ON media_library;
CREATE POLICY write_media_library ON media_library FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_projects ON projects;
CREATE POLICY select_projects ON projects FOR SELECT USING (true);
DROP POLICY IF EXISTS write_projects ON projects;
CREATE POLICY write_projects ON projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_testimonials ON testimonials;
CREATE POLICY select_testimonials ON testimonials FOR SELECT USING (true);
DROP POLICY IF EXISTS write_testimonials ON testimonials;
CREATE POLICY write_testimonials ON testimonials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_team ON team;
CREATE POLICY select_team ON team FOR SELECT USING (true);
DROP POLICY IF EXISTS write_team ON team;
CREATE POLICY write_team ON team FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_settings ON settings;
CREATE POLICY select_settings ON settings FOR SELECT USING (true);
DROP POLICY IF EXISTS write_settings ON settings;
CREATE POLICY write_settings ON settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS select_leads ON leads;
CREATE POLICY select_leads ON leads FOR SELECT USING (true);
DROP POLICY IF EXISTS write_leads ON leads;
CREATE POLICY write_leads ON leads FOR ALL USING (true) WITH CHECK (true);

-- Setup storage policies for our buckets if storage schema exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'storage' AND c.relname = 'objects') THEN
    
    -- products policies
    DROP POLICY IF EXISTS "products_select_policy" ON storage.objects;
    CREATE POLICY "products_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'products');
    DROP POLICY IF EXISTS "products_insert_policy" ON storage.objects;
    CREATE POLICY "products_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');
    DROP POLICY IF EXISTS "products_update_policy" ON storage.objects;
    CREATE POLICY "products_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');
    DROP POLICY IF EXISTS "products_delete_policy" ON storage.objects;
    CREATE POLICY "products_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'products');

    -- gallery policies
    DROP POLICY IF EXISTS "gallery_select_policy" ON storage.objects;
    CREATE POLICY "gallery_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
    DROP POLICY IF EXISTS "gallery_insert_policy" ON storage.objects;
    CREATE POLICY "gallery_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
    DROP POLICY IF EXISTS "gallery_update_policy" ON storage.objects;
    CREATE POLICY "gallery_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
    DROP POLICY IF EXISTS "gallery_delete_policy" ON storage.objects;
    CREATE POLICY "gallery_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'gallery');

    -- videos policies
    DROP POLICY IF EXISTS "videos_select_policy" ON storage.objects;
    CREATE POLICY "videos_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
    DROP POLICY IF EXISTS "videos_insert_policy" ON storage.objects;
    CREATE POLICY "videos_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');
    DROP POLICY IF EXISTS "videos_update_policy" ON storage.objects;
    CREATE POLICY "videos_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');
    DROP POLICY IF EXISTS "videos_delete_policy" ON storage.objects;
    CREATE POLICY "videos_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'videos');

    -- documents policies
    DROP POLICY IF EXISTS "documents_select_policy" ON storage.objects;
    CREATE POLICY "documents_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
    DROP POLICY IF EXISTS "documents_insert_policy" ON storage.objects;
    CREATE POLICY "documents_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
    DROP POLICY IF EXISTS "documents_update_policy" ON storage.objects;
    CREATE POLICY "documents_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');
    DROP POLICY IF EXISTS "documents_delete_policy" ON storage.objects;
    CREATE POLICY "documents_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'documents');

    -- logos policies
    DROP POLICY IF EXISTS "logos_select_policy" ON storage.objects;
    CREATE POLICY "logos_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
    DROP POLICY IF EXISTS "logos_insert_policy" ON storage.objects;
    CREATE POLICY "logos_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos');
    DROP POLICY IF EXISTS "logos_update_policy" ON storage.objects;
    CREATE POLICY "logos_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'logos') WITH CHECK (bucket_id = 'logos');
    DROP POLICY IF EXISTS "logos_delete_policy" ON storage.objects;
    CREATE POLICY "logos_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'logos');

    -- media policies
    DROP POLICY IF EXISTS "media_select_policy" ON storage.objects;
    CREATE POLICY "media_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'media');
    DROP POLICY IF EXISTS "media_insert_policy" ON storage.objects;
    CREATE POLICY "media_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
    DROP POLICY IF EXISTS "media_update_policy" ON storage.objects;
    CREATE POLICY "media_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
    DROP POLICY IF EXISTS "media_delete_policy" ON storage.objects;
    CREATE POLICY "media_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'media');

  END IF;
END $$;

-- Safeguard columns in gallery table for backward compatibility
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gallery') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'client') THEN
      ALTER TABLE gallery ADD COLUMN client TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'timeline') THEN
      ALTER TABLE gallery ADD COLUMN timeline TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'is_featured') THEN
      ALTER TABLE gallery ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery' AND column_name = 'image_url') THEN
      ALTER TABLE gallery ADD COLUMN image_url TEXT;
    END IF;
    -- Make imageUrl optional if it already exists
    ALTER TABLE gallery ALTER COLUMN "imageUrl" DROP NOT NULL;
  END IF;
END $$;
`;

// Helper to mask sensitive keys
function maskKey(key: string): string {
  if (!key) return "";
  if (key.length <= 10) return "****";
  return `${key.slice(0, 6)}...${key.slice(-4)}`;
}

// Endpoint to fetch current Supabase credentials
app.get("/api/supabase-config", (req, res) => {
  const url = (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const pgConn = (process.env.SUPABASE_PG_CONN_STRING || "").trim();
  
  const isValidUrl = url.startsWith("http://") || url.startsWith("https://");
  const isPlaceholder = url.includes("your-") || url.includes("placeholder") || key.includes("your-") || key.includes("placeholder");
  
  res.json({
    connected: !!(url && key && isValidUrl && !isPlaceholder),
    supabaseUrl: url,
    supabaseAnonKey: key,
    supabaseServiceRoleKey: serviceKey ? maskKey(serviceKey) : "",
    pgConnectionString: pgConn ? maskKey(pgConn) : ""
  });
});

// Endpoint to test Supabase client connection
app.post("/api/setup/test-connection", async (req, res) => {
  const { url, anonKey } = req.body;
  if (!url || !anonKey) {
    return res.status(400).json({ error: "Supabase Project URL and Anon Key are required." });
  }

  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();

  if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
    return res.status(400).json({ error: "Invalid URL format. Must start with http:// or https://" });
  }

  try {
    const tempClient = createClient(cleanUrl, cleanKey);
    // Ping with a dummy request
    const { error } = await tempClient.from("settings").select("id").limit(1);
    
    // We expect settings table error if DB not initialized yet, but connection itself is valid!
    // A connection failure will throw network exception or specific invalid API key errors.
    if (error && error.message.includes("Invalid API key")) {
      return res.status(400).json({ error: `Connection failed: ${error.message}` });
    }
    
    res.json({ success: true, message: "Tested Connection Successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to establish a network connection to Supabase." });
  }
});

// Endpoint to save Supabase connection variables
app.post("/api/setup/save-config", (req, res) => {
  const { url, anonKey, serviceRoleKey, pgConnectionString } = req.body;
  if (!url || !anonKey) {
    return res.status(400).json({ error: "Project URL and Publishable Anon Key are mandatory." });
  }

  try {
    const updates: Record<string, string> = {
      SUPABASE_URL: url.trim(),
      SUPABASE_ANON_KEY: anonKey.trim()
    };

    if (serviceRoleKey) {
      updates.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey.trim();
    }
    if (pgConnectionString) {
      updates.SUPABASE_PG_CONN_STRING = pgConnectionString.trim();
    }

    updateEnvFile(updates);
    res.json({ success: true, message: "Configuration variables saved and applied in memory successfully." });
  } catch (err: any) {
    res.status(500).json({ error: `Failed to save configuration: ${err.message}` });
  }
});

// Endpoint to fetch overall installation and component status
app.get("/api/setup/status", async (req, res) => {
  const url = (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
  const pgConn = (process.env.SUPABASE_PG_CONN_STRING || "").trim();
  
  const isConfigured = !!(url && key && url.startsWith("http") && !url.includes("placeholder"));
  
  if (!isConfigured) {
    return res.json({
      connected: false,
      buckets: { products: "missing", gallery: "missing", videos: "missing", documents: "missing", logos: "missing", media: "missing" },
      tables: {
        products: false, product_images: false, product_documents: false, gallery: false, categories: false, blogs: false, downloads: false, team_members: false, contact_leads: false, quote_requests: false, website_settings: false, admin_users: false, media_library: false,
        projects: false, testimonials: false, team: false, settings: false, leads: false
      },
      hasAdminUser: false,
      sqlScript: CMS_MIGRATION_SQL
    });
  }

  const status = {
    connected: true,
    buckets: { products: "missing", gallery: "missing", videos: "missing", documents: "missing", logos: "missing", media: "missing" },
    tables: {
      products: false, product_images: false, product_documents: false, gallery: false, categories: false, blogs: false, downloads: false, team_members: false, contact_leads: false, quote_requests: false, website_settings: false, admin_users: false, media_library: false,
      projects: false, testimonials: false, team: false, settings: false, leads: false
    },
    hasAdminUser: false,
    sqlScript: CMS_MIGRATION_SQL
  };

  const supabase = createClient(url, key);

  // Check database tables via standard query
  const tableNames = [
    "products", "product_images", "product_documents", "gallery", "categories", "blogs", "downloads", "team_members", "contact_leads", "quote_requests", "website_settings", "admin_users", "media_library",
    "projects", "testimonials", "team", "settings", "leads"
  ];

  for (const table of tableNames) {
    try {
      const { error } = await supabase.from(table).select("*").limit(1);
      if (!error) {
        (status.tables as any)[table] = true;
      } else {
        const msg = error.message || "";
        const isMissing = (msg.includes("relation") && msg.includes("does not exist")) ||
                          (msg.includes("Could not find") && msg.includes("schema cache"));
        if (!isMissing) {
          (status.tables as any)[table] = true;
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  // Check if admin user exists in admin_users table
  try {
    const { data, error } = await supabase.from("admin_users").select("id").limit(1);
    if (!error && data && data.length > 0) {
      status.hasAdminUser = true;
    }
  } catch (e) {}

  // Check Buckets
  const adminClient = getSupabaseAdminClient() || supabase;
  try {
    const { data: buckets, error } = await adminClient.storage.listBuckets();
    if (!error && buckets) {
      for (const bucket of buckets) {
        if (bucket.name in status.buckets) {
          (status.buckets as any)[bucket.name] = "ready";
        }
      }
    }
  } catch (e) {}

  res.json(status);
});

// Endpoint to automatically create buckets using Admin client
app.post("/api/setup/create-buckets", async (req, res) => {
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return res.status(400).json({
      error: "Service Role Key is required to programmatically create buckets. Please save the Service Role Key in Step 1 first, or create buckets manually in the Supabase Dashboard."
    });
  }

  const bucketsToCreate = ["products", "gallery", "videos", "documents", "logos", "media"];
  const results: Record<string, string> = {};

  try {
    for (const b of bucketsToCreate) {
      const { error } = await adminClient.storage.createBucket(b, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
      
      if (!error || error.message.includes("already exists")) {
        results[b] = "success";
      } else {
        results[b] = `failed: ${error.message}`;
      }
    }
    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ error: `Bucket creation threw exception: ${err.message}` });
  }
});

// Endpoint to initialize Database via pg Connection String
app.post("/api/setup/initialize-database", async (req, res) => {
  const pgConn = (process.env.SUPABASE_PG_CONN_STRING || "").trim();
  if (!pgConn) {
    return res.status(400).json({
      error: "PostgreSQL Connection String is not configured. Please save it in Step 1, or execute the SQL script manually in the Supabase Dashboard SQL Editor."
    });
  }

  const client = new pg.Client({
    connectionString: pgConn,
    ssl: { rejectUnauthorized: false } // Required for Supabase cloud hosts
  });

  try {
    await client.connect();
    await client.query(CMS_MIGRATION_SQL);
    await client.end();
    res.json({ success: true, message: "Database tables migrated and initialized successfully." });
  } catch (err: any) {
    try { await client.end(); } catch (e) {}
    res.status(500).json({ error: `Database migration failed: ${err.message}` });
  }
});

// Endpoint to register the primary admin user in both Auth and DB
app.post("/api/setup/create-admin-user", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email and password are required." });
  }

  const url = (process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const anonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "").trim();
  
  if (!url || !anonKey) {
    return res.status(400).json({ error: "Supabase client is not configured yet." });
  }

  const adminClient = getSupabaseAdminClient();
  const supabase = createClient(url, anonKey);

  try {
    let authUserId = "";

    // 1. Create in Supabase Auth using Admin Client (bypassing email confirmation links)
    if (adminClient) {
      const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username, role: "Administrator" }
      });

      if (authError) {
        // If it fails because user already exists, try to fetch or log it
        if (authError.message.includes("already registered")) {
          // Continue to insert in DB in case it's missing there
        } else {
          return res.status(400).json({ error: `Auth Signup Error: ${authError.message}` });
        }
      } else if (authUser && authUser.user) {
        authUserId = authUser.user.id;
      }
    }

    // 2. Generate a local ID fallback if authUserId is not populated
    if (!authUserId) {
      authUserId = "admin_" + Date.now();
    }

    // Hash password with SHA-256 for local sync & local-db fallback
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    const newAdmin: ServerAdminUser = {
      id: authUserId,
      username,
      email,
      passwordHash,
      role: "Administrator",
      createdAt: new Date().toISOString()
    };

    // 3. Upsert into admin_users table in Supabase
    const { error: dbError } = await supabase.from("admin_users").upsert([newAdmin]);
    if (dbError) {
      console.warn("Could not insert admin into 'admin_users' table:", dbError.message);
    }

    // 4. Also register into local JSON file admin-db.json for fallback
    let localAdmins: ServerAdminUser[] = [];
    if (fs.existsSync(ADMIN_DB_FILE)) {
      try {
        localAdmins = JSON.parse(fs.readFileSync(ADMIN_DB_FILE, "utf-8"));
      } catch (e) {}
    }
    
    if (!localAdmins.some(a => a.email === email)) {
      localAdmins.push(newAdmin);
      fs.writeFileSync(ADMIN_DB_FILE, JSON.stringify(localAdmins, null, 2), "utf-8");
    }

    res.json({
      success: true,
      message: `Initial Administrator account "${username}" registered successfully!${adminClient ? " User also created in Supabase Auth." : ""}`
    });
  } catch (err: any) {
    res.status(500).json({ error: `Admin creation threw exception: ${err.message}` });
  }
});


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

    const adminClient = getSupabaseAdminClient() || getSupabaseClient();
    if (adminClient) {
      try {
        const { error } = await adminClient.from("leads").insert([newLead]);
        if (error) {
          console.warn("Could not insert lead to Supabase 'leads' table:", error.message);
        } else {
          console.log("Successfully saved lead to Supabase 'leads' table!");
        }
      } catch (err) {
        console.error("Exception saving lead to Supabase in server:", err);
      }
    }

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
app.get("/api/leads", requireSession, async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("leads").select("*").order("createdAt", { ascending: false });
      if (!error && data) {
        return res.json(data);
      }
      if (error) {
        console.warn("Could not fetch leads from Supabase table 'leads'. Falling back to local json:", error.message);
      }
    }
    const leads = readLeads();
    return res.json(leads);
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching database leads" });
  }
});

// Update lead status (Requires active operational session)
app.put("/api/leads/:id", requireSession, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from("leads").update({ status }).eq("id", id);
        if (error) {
          console.warn("Could not update lead in Supabase 'leads' table:", error.message);
        }
      } catch (err) {
        console.error("Exception updating lead in Supabase:", err);
      }
    }

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
app.delete("/api/leads/:id", requireSession, async (req, res) => {
  try {
    const { id } = req.params;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from("leads").delete().eq("id", id);
        if (error) {
          console.warn("Could not delete lead from Supabase 'leads' table:", error.message);
        }
      } catch (err) {
        console.error("Exception deleting lead in Supabase:", err);
      }
    }

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

// --- PROTECTED GLOBAL CMS SYNC ENDPOINT ---
app.post("/api/cms/sync/:table", requireSession, async (req, res) => {
  const { table } = req.params;
  const items = req.body;
  
  const adminClient = getSupabaseAdminClient();
  if (!adminClient) {
    return res.status(500).json({ success: false, message: "Supabase admin client not initialized on server." });
  }

  try {
    if (table === "settings") {
      const settingsObj = Array.isArray(items) ? items[0] : items;
      const { error } = await adminClient.from("settings").upsert({ id: "website_settings", ...settingsObj });
      if (error) {
        console.error("Settings sync error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
      }
      return res.json({ success: true });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Expected an array of items for syncing." });
    }

    // Determine IDs to keep
    const ids = items.map((item: any) => item.id).filter(Boolean);
    
    // Delete removed items
    if (ids.length > 0) {
      const formattedIds = ids.map(id => `'${id}'`).join(",");
      const { error: deleteError } = await adminClient
        .from(table)
        .delete()
        .filter("id", "not.in", `(${formattedIds})`);
      if (deleteError) {
        console.warn(`Sync delete warn for ${table}:`, deleteError.message);
      }
    } else {
      const { error: deleteError } = await adminClient
        .from(table)
        .delete()
        .neq("id", "");
      if (deleteError) {
        console.warn(`Sync delete all warn for ${table}:`, deleteError.message);
      }
    }

    // Upsert the new/updated items
    if (items.length > 0) {
      const mappedItems = items.map((item: any) => {
        if (table === "gallery") {
          return {
            id: item.id,
            title: item.title,
            category: item.category,
            imageUrl: item.imageUrl || item.image_url || "",
            image_url: item.imageUrl || item.image_url || "",
            videoUrl: item.videoUrl || item.video_url || "",
            video_url: item.videoUrl || item.video_url || "",
            location: item.location || "",
            description: item.description || "",
            specs: item.specs || {},
            client: item.client || "",
            timeline: item.timeline || "",
            is_featured: !!item.is_featured,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        return item;
      });

      const { error: upsertError } = await adminClient.from(table).upsert(mappedItems);
      if (upsertError) {
        console.error(`Upsert error for ${table}:`, upsertError.message);
        return res.status(400).json({ success: false, message: upsertError.message });
      }
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error(`Exception syncing ${table} on server:`, err);
    return res.status(500).json({ success: false, message: err.message });
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
