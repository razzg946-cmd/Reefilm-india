# Reefilm India - Enterprise Deployment Guide
This guide provides step-by-step instructions for deploying the production-ready Reefilm India platform with Next.js 15, Supabase, and Resend Email API.

---

## Architecture Overview
The platform transitions from a local development environment to a secure, enterprise-grade cloud architecture:
- **Frontend / Backend Server**: Next.js 15 App Router, React, and TypeScript deployed on Vercel.
- **Relational Database**: Supabase PostgreSQL featuring strict Row-Level Security (RLS) policies.
- **Object Storage**: Supabase Storage Buckets optimized for large architectural attachments (PDF, DWG, DXF, PNG, JPG, ZIP; up to 25MB).
- **Transactional Emails**: Resend Email API delivering HTML-responsive notification layouts to both Raj Gupta and prospective customers.

---

## Step 1: Create a Supabase Project
1. Go to [Supabase Console](https://supabase.com) and sign in.
2. Click **New Project**, select your organization, and fill out:
   - **Name**: `reefilm-india`
   - **Database Password**: Generate a secure password and save it safely.
   - **Region**: Choose the region closest to India (e.g., `ap-south-1` Mumbai or `ap-southeast-1` Singapore) to optimize low-latency client performance.
3. Wait for the database provisioning to complete (typically ~1 minute).

---

## Step 2: Run SQL Migrations
1. In your Supabase Dashboard, navigate to the **SQL Editor** tab from the left navigation menu.
2. Click **New Query**.
3. Open the file `production/supabase/migrations/20260627_init.sql` from your repository, copy the entire SQL script, and paste it into the editor.
4. Click **Run**.
5. This migration script automatically provisions:
   - Table structures for `contacts`, `quote_requests`, `products`, `categories`, `gallery`, `project_images`, `blogs`, `downloads`, `newsletter`, `admins`, `settings`, `testimonials`, and `activity_logs`.
   - Primary UUID keys, indexes, triggers, and relation joins.
   - Enforce Row Level Security (RLS) on all tables.
   - Insert default admin operators, certified product lists, active portfolio structures, and download catalogs.

---

## Step 3: Create Supabase Storage Buckets
To support large blueprint uploads (PDF, DWG, DXF) and site inspection photos (PNG, JPG, ZIP) up to 25MB:
1. In the Supabase Dashboard, click on **Storage** in the left sidebar.
2. Click **New Bucket** and configure the following storage nodes:
   - **Quotes** (`quotes`): Make it **Public** (for storing and referencing submitted project spec sheets).
   - **Drawings** (`drawings`): Make it **Private** (secure storage only accessible to logged-in admins).
   - **Gallery** (`gallery`): Make it **Public**.
   - **Products** (`products`): Make it **Public**.
   - **Blogs** (`blogs`): Make it **Public**.
   - **Certificates** (`certificates`): Make it **Public**.
   - **Uploads** (`uploads`): Make it **Public**.
3. Click **Save** on each bucket.
4. The RLS rules executed in the previous step automatically secure drawing download endpoints so only authenticated Reefilm administrators can retrieve files from the private `drawings` bucket.

---

## Step 4: Configure Resend Email Account
1. Create a free account at [Resend](https://resend.com).
2. Go to the **Domains** section in your Resend Dashboard and click **Add Domain**.
3. Add your business domain (e.g., `reefilm.in`).
4. Update your Domain Provider's DNS records with the generated MX, SPF, and DKIM parameters provided by Resend to authorize clean mail delivery.
5. Create an API Key in the **API Keys** section. Save this key (`re_...`) for your environment variables.

---

## Step 5: Connect and Deploy on Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Connect your Git repository (GitHub / GitLab / Bitbucket) where your production code is pushed.
3. On the **Configure Project** page, expand the **Environment Variables** section and insert all secrets listed in the section below.
4. Set the framework preset to **Next.js**.
5. Click **Deploy**. Vercel will bundle assets, compile serverless functions, optimize images, and launch your live production endpoints.

---

## Environment Variables Configuration
Paste these keys directly into your Vercel Dashboard and update `.env` for local testing:

```env
# Supabase Keys (Available in Supabase Settings > API)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..." # KEEP HIGHLY SECRET - Used strictly in secure Server Actions

# Resend Mail Keys (Available in Resend Settings > API Keys)
RESEND_API_KEY="re_123456789"

# Core Communications
NEXT_PUBLIC_SITE_URL="https://reefilm.in"
NEXT_PUBLIC_WHATSAPP_NUMBER="918577917327"
ADMIN_EMAIL="razzg946@gmail.com"
```

---

## Step 6: Verify and Test Integrations
### 1. Test the Contact Form
- Navigate to your deployed homepage `/contact`.
- Fill out the Contact Form.
- Submit the form and verify that the success state displays: `"Thank you for contacting Reefilm India. Our sales team will contact you shortly."`
- Check the Supabase table `contacts` to verify the submission was recorded.
- Confirm that **razzg946@gmail.com** receives a fully detailed notification email, and that your test email receives a personalized confirmation.

### 2. Test the Quote Form
- Go to `/quote` and complete the 3-step interactive wizard.
- Upload a dummy blueprint file (e.g., PDF) and a site photo.
- Click **Submit**. Verify that the file upload succeeds, a unique **Quote ID** is displayed, and metadata is accurately synchronized with Supabase.
- Log in to your Admin Panel (`/admin`) and verify you can view the quote, inspect the specs, and securely download the uploaded attachments.
