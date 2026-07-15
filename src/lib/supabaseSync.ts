import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { Product, Project, ApplicationItem, BlogPost, ResourceDoc, Testimonial, LeadInquiry, GalleryItem, TeamMember, WebsiteSettings, AdminUser } from "../types";

// Helper to handle safe fetching with graceful fallback
async function safeFetch<T>(tableName: string, defaultData: T[]): Promise<T[] | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("id");

    if (error) {
      console.warn(`Could not fetch from Supabase table '${tableName}'. It may not exist yet:`, error.message);
      return null;
    }
    return data as T[];
  } catch (err) {
    console.error(`Exception while fetching from table '${tableName}':`, err);
    return null;
  }
}

// Helper to execute secure backend synchronization bypassing public anon key write restrictions
async function secureServerSync(tableName: string, data: any): Promise<boolean> {
  const sessionObj = localStorage.getItem("reefilm_admin_session");
  if (!sessionObj) {
    console.warn(`Attempted to sync table '${tableName}' without an active admin session.`);
    return false;
  }
  try {
    const { token } = JSON.parse(sessionObj);
    const response = await fetch(`/api/cms/sync/${tableName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        console.warn(`Admin session is invalid or expired. Clearing local session.`);
        localStorage.removeItem("reefilm_admin_session");
        window.dispatchEvent(new Event("storage"));
      }
      const errData = await response.json().catch(() => ({}));
      console.error(`Secure server sync for table '${tableName}' failed:`, errData.message || response.statusText);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Exception during secure server sync for table '${tableName}':`, err);
    return false;
  }
}

// 1. PRODUCTS
export async function fetchProducts(defaultData: Product[]): Promise<Product[] | null> {
  return safeFetch<Product>("products", defaultData);
}

export async function syncProducts(products: Product[]): Promise<void> {
  await secureServerSync("products", products);
}

// 2. PROJECTS
export async function fetchProjects(defaultData: Project[]): Promise<Project[] | null> {
  return safeFetch<Project>("projects", defaultData);
}

export async function syncProjects(projects: Project[]): Promise<void> {
  await secureServerSync("projects", projects);
}

// 3. BLOG POSTS
export async function fetchBlogs(defaultData: BlogPost[]): Promise<BlogPost[] | null> {
  return safeFetch<BlogPost>("blogs", defaultData);
}

export async function syncBlogs(blogs: BlogPost[]): Promise<void> {
  await secureServerSync("blogs", blogs);
}

// 4. DOWNLOADS / RESOURCES
export async function fetchDownloads(defaultData: ResourceDoc[]): Promise<ResourceDoc[] | null> {
  return safeFetch<ResourceDoc>("downloads", defaultData);
}

export async function syncDownloads(downloads: ResourceDoc[]): Promise<void> {
  await secureServerSync("downloads", downloads);
}

// 5. TESTIMONIALS
export async function fetchTestimonials(defaultData: Testimonial[]): Promise<Testimonial[] | null> {
  return safeFetch<Testimonial>("testimonials", defaultData);
}

export async function syncTestimonials(testimonials: Testimonial[]): Promise<void> {
  await secureServerSync("testimonials", testimonials);
}

// 6. GALLERY ITEMS
export async function fetchGallery(defaultData: GalleryItem[]): Promise<GalleryItem[] | null> {
  const data = await safeFetch<GalleryItem>("gallery", defaultData);
  if (data) {
    return data.map(item => ({
      ...item,
      imageUrl: item.imageUrl || (item as any).image_url || "",
      videoUrl: item.videoUrl || (item as any).video_url || "",
      isDemo: item.isDemo !== undefined ? !!item.isDemo : !!(item as any).is_demo
    }));
  }
  return data;
}

export async function syncGallery(gallery: GalleryItem[]): Promise<void> {
  await secureServerSync("gallery", gallery);
}

// 7. TEAM MEMBERS
export async function fetchTeam(defaultData: TeamMember[]): Promise<TeamMember[] | null> {
  return safeFetch<TeamMember>("team", defaultData);
}

export async function syncTeam(team: TeamMember[]): Promise<void> {
  await secureServerSync("team", team);
}

// 8. WEBSITE SETTINGS
export async function fetchSettings(defaultData: WebsiteSettings): Promise<WebsiteSettings | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("id", "website_settings")
      .single();

    if (error) {
      console.warn("Could not fetch settings from Supabase settings table:", error.message);
      return null;
    }
    if (data) {
      const { id, ...cleanSettings } = data;
      return cleanSettings as WebsiteSettings;
    }
    return null;
  } catch (err) {
    console.error("Exception fetching settings:", err);
    return null;
  }
}

export async function syncSettings(settings: WebsiteSettings): Promise<void> {
  await secureServerSync("settings", settings);
}

// 9. ADMIN USERS
export async function fetchAdminUsers(defaultData: AdminUser[]): Promise<AdminUser[] | null> {
  return safeFetch<AdminUser>("admin_users", defaultData);
}

export async function syncAdminUsers(adminUsers: AdminUser[]): Promise<void> {
  await secureServerSync("admin_users", adminUsers);
}

// 10. LEADS
export async function fetchLeads(defaultData: LeadInquiry[]): Promise<LeadInquiry[] | null> {
  return safeFetch<LeadInquiry>("leads", defaultData);
}

export async function syncLeads(leads: LeadInquiry[]): Promise<void> {
  await secureServerSync("leads", leads);
}

// Single lead addition helper
export async function addLeadToSupabase(lead: LeadInquiry): Promise<boolean> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    });
    return response.ok;
  } catch (err) {
    console.error("Exception adding lead to Supabase:", err);
    return false;
  }
}

// 11. APPLICATIONS
export async function fetchApplications(defaultData: ApplicationItem[]): Promise<ApplicationItem[] | null> {
  return safeFetch<ApplicationItem>("applications", defaultData);
}

export async function syncApplications(applications: ApplicationItem[]): Promise<void> {
  await secureServerSync("applications", applications);
}
