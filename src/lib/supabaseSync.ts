import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { Product, Project, BlogPost, ResourceDoc, Testimonial, LeadInquiry, GalleryItem, TeamMember, WebsiteSettings, AdminUser } from "../types";

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

// 1. PRODUCTS
export async function fetchProducts(defaultData: Product[]): Promise<Product[] | null> {
  return safeFetch<Product>("products", defaultData);
}

export async function syncProducts(products: Product[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = products.map((p) => p.id);
    if (ids.length > 0) {
      // Delete any items from Supabase that are not in the current list
      await supabase.from("products").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("products").delete().neq("id", "");
    }
    
    if (products.length > 0) {
      const { error } = await supabase.from("products").upsert(products);
      if (error) console.warn("Supabase products upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing products:", err);
  }
}

// 2. PROJECTS
export async function fetchProjects(defaultData: Project[]): Promise<Project[] | null> {
  return safeFetch<Project>("projects", defaultData);
}

export async function syncProjects(projects: Project[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = projects.map((p) => p.id);
    if (ids.length > 0) {
      await supabase.from("projects").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("projects").delete().neq("id", "");
    }

    if (projects.length > 0) {
      const { error } = await supabase.from("projects").upsert(projects);
      if (error) console.warn("Supabase projects upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing projects:", err);
  }
}

// 3. BLOG POSTS
export async function fetchBlogs(defaultData: BlogPost[]): Promise<BlogPost[] | null> {
  return safeFetch<BlogPost>("blogs", defaultData);
}

export async function syncBlogs(blogs: BlogPost[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = blogs.map((b) => b.id);
    if (ids.length > 0) {
      await supabase.from("blogs").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("blogs").delete().neq("id", "");
    }

    if (blogs.length > 0) {
      const { error } = await supabase.from("blogs").upsert(blogs);
      if (error) console.warn("Supabase blogs upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing blogs:", err);
  }
}

// 4. DOWNLOADS / RESOURCES
export async function fetchDownloads(defaultData: ResourceDoc[]): Promise<ResourceDoc[] | null> {
  return safeFetch<ResourceDoc>("downloads", defaultData);
}

export async function syncDownloads(downloads: ResourceDoc[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = downloads.map((d) => d.id);
    if (ids.length > 0) {
      await supabase.from("downloads").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("downloads").delete().neq("id", "");
    }

    if (downloads.length > 0) {
      const { error } = await supabase.from("downloads").upsert(downloads);
      if (error) console.warn("Supabase downloads upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing downloads:", err);
  }
}

// 5. TESTIMONIALS
export async function fetchTestimonials(defaultData: Testimonial[]): Promise<Testimonial[] | null> {
  return safeFetch<Testimonial>("testimonials", defaultData);
}

export async function syncTestimonials(testimonials: Testimonial[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = testimonials.map((t) => t.id);
    if (ids.length > 0) {
      await supabase.from("testimonials").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("testimonials").delete().neq("id", "");
    }

    if (testimonials.length > 0) {
      const { error } = await supabase.from("testimonials").upsert(testimonials);
      if (error) console.warn("Supabase testimonials upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing testimonials:", err);
  }
}

// 6. GALLERY ITEMS
export async function fetchGallery(defaultData: GalleryItem[]): Promise<GalleryItem[] | null> {
  return safeFetch<GalleryItem>("gallery", defaultData);
}

export async function syncGallery(gallery: GalleryItem[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = gallery.map((g) => g.id);
    if (ids.length > 0) {
      await supabase.from("gallery").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("gallery").delete().neq("id", "");
    }

    if (gallery.length > 0) {
      const { error } = await supabase.from("gallery").upsert(gallery);
      if (error) console.warn("Supabase gallery upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing gallery:", err);
  }
}

// 7. TEAM MEMBERS
export async function fetchTeam(defaultData: TeamMember[]): Promise<TeamMember[] | null> {
  return safeFetch<TeamMember>("team", defaultData);
}

export async function syncTeam(team: TeamMember[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = team.map((t) => t.id);
    if (ids.length > 0) {
      await supabase.from("team").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("team").delete().neq("id", "");
    }

    if (team.length > 0) {
      const { error } = await supabase.from("team").upsert(team);
      if (error) console.warn("Supabase team upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing team:", err);
  }
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
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from("settings")
      .upsert({ id: "website_settings", ...settings });
    if (error) console.warn("Supabase settings upsert warning:", error.message);
  } catch (err) {
    console.error("Exception syncing settings:", err);
  }
}

// 9. ADMIN USERS
export async function fetchAdminUsers(defaultData: AdminUser[]): Promise<AdminUser[] | null> {
  return safeFetch<AdminUser>("admin_users", defaultData);
}

export async function syncAdminUsers(adminUsers: AdminUser[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = adminUsers.map((u) => u.id);
    if (ids.length > 0) {
      await supabase.from("admin_users").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("admin_users").delete().neq("id", "");
    }

    if (adminUsers.length > 0) {
      const { error } = await supabase.from("admin_users").upsert(adminUsers);
      if (error) console.warn("Supabase admin_users upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing admin_users:", err);
  }
}

// 10. LEADS
export async function fetchLeads(defaultData: LeadInquiry[]): Promise<LeadInquiry[] | null> {
  return safeFetch<LeadInquiry>("leads", defaultData);
}

export async function syncLeads(leads: LeadInquiry[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const ids = leads.map((l) => l.id);
    if (ids.length > 0) {
      await supabase.from("leads").delete().not("id", "in", `(${ids.join(",")})`);
    } else {
      await supabase.from("leads").delete().neq("id", "");
    }

    if (leads.length > 0) {
      const { error } = await supabase.from("leads").upsert(leads);
      if (error) console.warn("Supabase leads upsert warning:", error.message);
    }
  } catch (err) {
    console.error("Exception syncing leads:", err);
  }
}

// Single lead addition helper
export async function addLeadToSupabase(lead: LeadInquiry): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from("leads").insert([lead]);
    if (error) {
      console.warn("Could not insert lead directly to Supabase table 'leads':", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception adding lead to Supabase:", err);
    return false;
  }
}
