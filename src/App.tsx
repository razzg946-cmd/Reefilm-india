import React, { useState, useEffect, FormEvent } from "react";
import { 
  INITIAL_PRODUCTS, INITIAL_PROJECTS, INITIAL_BLOG_POSTS, INITIAL_RESOURCES, TESTIMONIALS, INITIAL_LEADS,
  INITIAL_GALLERY_ITEMS, INITIAL_TEAM_MEMBERS, INITIAL_SETTINGS, INITIAL_ADMIN_USERS, APPLICATIONS
} from "./data";
import { Product, Project, ApplicationItem, BlogPost, ResourceDoc, Testimonial, LeadInquiry, GalleryItem, TeamMember, WebsiteSettings, AdminUser } from "./types";
import { 
  fetchProducts, syncProducts,
  fetchProjects, syncProjects,
  fetchBlogs, syncBlogs,
  fetchDownloads, syncDownloads,
  fetchTestimonials, syncTestimonials,
  fetchGallery, syncGallery,
  fetchTeam, syncTeam,
  fetchSettings, syncSettings,
  fetchAdminUsers, syncAdminUsers,
  fetchLeads, syncLeads,
  fetchApplications, syncApplications
} from "./lib/supabaseSync";
import { initializeSupabaseDynamically } from "./lib/supabase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import AboutView from "./components/AboutView";
import ProductsView from "./components/ProductsView";
import ApplicationsView from "./components/ApplicationsView";
import ProjectsView from "./components/ProjectsView";
import GalleryView from "./components/GalleryView";
import ResourcesView from "./components/ResourcesView";
import BlogView from "./components/BlogView";
import ContactView from "./components/ContactView";
import QuoteView from "./components/QuoteView";
import AdminDashboard from "./components/AdminDashboard";
import FloatingActions from "./components/FloatingActions";

import { 
  Building2, ShoppingBag, Landmark, ArrowRight, Star, ShieldAlert, CheckCircle2, 
  Lightbulb, ChevronRight, Award, Zap, ShieldCheck 
} from "lucide-react";

// Synchronously clean legacy schema cache from prior sessions to prevent rendering crashes
try {
  if (typeof window !== "undefined" && window.localStorage) {
    const currentVersion = "4.0";
    const savedVersion = window.localStorage.getItem("reefilm_schema_version");
    if (savedVersion !== currentVersion) {
      window.localStorage.removeItem("reefilm_leads");
      window.localStorage.removeItem("reefilm_products");
      window.localStorage.removeItem("reefilm_projects");
      window.localStorage.removeItem("reefilm_blogs");
      window.localStorage.removeItem("reefilm_downloads");
      window.localStorage.removeItem("reefilm_testimonials");
      window.localStorage.setItem("reefilm_schema_version", currentVersion);
    }
  }
} catch (e) {
  console.error("Synchronous local storage migration failed:", e);
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string>("");
  const [productSearchTerm, setProductSearchTerm] = useState<string>("");

  // Keep path synced with tab state for /admin router compliance
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handlePathCheck = () => {
        const path = window.location.pathname;
        if (path === "/admin") {
          setCurrentTab("admin");
        } else {
          const cleanPath = path.replace(/^\//, "").trim();
          if (cleanPath && ["about", "products", "applications", "projects", "gallery", "resources", "blog", "contact", "quote"].includes(cleanPath)) {
            setCurrentTab(cleanPath);
          } else {
            setCurrentTab("home");
          }
        }
      };

      handlePathCheck();
      window.addEventListener("popstate", handlePathCheck);
      return () => window.removeEventListener("popstate", handlePathCheck);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentTab === "admin" && currentPath !== "/admin") {
        window.history.pushState(null, "", "/admin");
      } else if (currentTab !== "admin" && currentPath === "/admin") {
        window.history.pushState(null, "", "/");
      } else if (currentTab !== "admin" && currentTab !== "home" && currentPath !== `/${currentTab}`) {
        window.history.pushState(null, "", `/${currentTab}`);
      } else if (currentTab === "home" && currentPath !== "/" && currentPath !== "") {
        window.history.pushState(null, "", "/");
      }
    }
  }, [currentTab]);

  // Helper validation schemas
  const isValidString = (val: any): boolean => {
    return typeof val === "string" && val.trim().length > 0;
  };

  const isValidArrayOfStrings = (val: any): boolean => {
    return Array.isArray(val) && val.every(item => typeof item === "string");
  };

  const validateLeadSchema = (parsed: any): parsed is LeadInquiry[] => {
    if (!Array.isArray(parsed)) return false;
    return parsed.every(lead => (
      lead &&
      isValidString(lead.id) &&
      isValidString(lead.fullName) &&
      isValidString(lead.email) &&
      isValidString(lead.status) &&
      isValidString(lead.createdAt)
    ));
  };

  const validateProductSchema = (parsed: any): parsed is Product[] => {
    if (!Array.isArray(parsed)) return false;
    return parsed.every(product => (
      product &&
      isValidString(product.id) &&
      isValidString(product.name) &&
      isValidString(product.category) &&
      isValidString(product.description) &&
      isValidArrayOfStrings(product.features) &&
      isValidArrayOfStrings(product.benefits) &&
      product.specifications &&
      typeof product.specifications === "object" &&
      isValidString(product.specifications.pitch) &&
      isValidString(product.specifications.brightness)
    ));
  };

  const validateProjectSchema = (parsed: any): parsed is Project[] => {
    if (!Array.isArray(parsed)) return false;
    return parsed.every(project => (
      project &&
      isValidString(project.id) &&
      isValidString(project.title) &&
      isValidString(project.category) &&
      isValidString(project.location) &&
      isValidString(project.client) &&
      isValidString(project.description) &&
      isValidArrayOfStrings(project.techUsed)
    ));
  };

  const validateBlogSchema = (parsed: any): parsed is BlogPost[] => {
    if (!Array.isArray(parsed)) return false;
    return parsed.every(blog => (
      blog &&
      isValidString(blog.id) &&
      isValidString(blog.title) &&
      isValidString(blog.excerpt) &&
      isValidString(blog.content) &&
      isValidString(blog.category) &&
      isValidArrayOfStrings(blog.tags) &&
      isValidString(blog.publishedAt) &&
      isValidString(blog.author)
    ));
  };

  const validateResourceSchema = (parsed: any): parsed is ResourceDoc[] => {
    if (!Array.isArray(parsed)) return false;
    return parsed.every(doc => (
      doc &&
      isValidString(doc.id) &&
      isValidString(doc.title) &&
      isValidString(doc.category) &&
      isValidString(doc.fileSize) &&
      typeof doc.downloadCount === "number"
    ));
  };

  const validateTestimonialSchema = (parsed: any): parsed is Testimonial[] => {
    if (!Array.isArray(parsed)) return false;
    return parsed.every(t => (
      t &&
      isValidString(t.id) &&
      isValidString(t.name) &&
      isValidString(t.designation) &&
      isValidString(t.company) &&
      isValidString(t.text) &&
      typeof t.rating === "number"
    ));
  };

  // Reactive State databases
  const [leads, setLeads] = useState<LeadInquiry[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_leads");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (validateLeadSchema(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading leads from localStorage:", e);
    }
    return INITIAL_LEADS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (validateProductSchema(parsed)) {
          const validated = parsed.map((p: any) => {
            const matched = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
            if (matched) {
              return {
                ...matched,
                ...p,
                specifications: {
                  ...matched.specifications,
                  ...(p.specifications || {})
                },
                benefits: Array.isArray(p.benefits) ? p.benefits : matched.benefits,
                features: Array.isArray(p.features) ? p.features : matched.features,
                image: p.image || matched.image
              };
            }
            return p;
          }).filter((item): item is Product => item !== null);

          if (validated.length > 0) {
            return validated;
          }
        }
      }
    } catch (e) {
      console.error("Error reading products from localStorage:", e);
    }
    return INITIAL_PRODUCTS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (validateProjectSchema(parsed)) {
          const validated = parsed.map((p: any) => {
            const matched = INITIAL_PROJECTS.find(ip => ip.id === p.id);
            if (matched) {
              return {
                ...matched,
                ...p,
                beforeImage: p.beforeImage || matched.beforeImage,
                afterImage: p.afterImage || matched.afterImage,
                techUsed: Array.isArray(p.techUsed) ? p.techUsed : matched.techUsed,
                projectHighlights: Array.isArray(p.projectHighlights) ? p.projectHighlights : matched.projectHighlights || [],
                customerBenefits: Array.isArray(p.customerBenefits) ? p.customerBenefits : matched.customerBenefits || []
              };
            }
            return p;
          }).filter((item): item is Project => item !== null);

          if (validated.length > 0) {
            return validated;
          }
        }
      }
    } catch (e) {
      console.error("Error reading projects from localStorage:", e);
    }
    return INITIAL_PROJECTS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_blogs");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (validateBlogSchema(parsed)) {
          const validated = parsed.map((b: any) => {
            const matched = INITIAL_BLOG_POSTS.find(ib => ib.id === b.id);
            if (matched) {
              return {
                ...matched,
                ...b,
                image: b.image || matched.image,
                tags: Array.isArray(b.tags) ? b.tags : matched.tags
              };
            }
            return b;
          }).filter((item): item is BlogPost => item !== null);

          if (validated.length > 0) {
            return validated;
          }
        }
      }
    } catch (e) {
      console.error("Error reading blogs from localStorage:", e);
    }
    return INITIAL_BLOG_POSTS;
  });

  const [downloads, setDownloads] = useState<ResourceDoc[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_downloads");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (validateResourceSchema(parsed)) {
          const validated = parsed.map((d: any) => {
            const matched = INITIAL_RESOURCES.find(ir => ir.id === d.id);
            if (matched) {
              return {
                ...matched,
                ...d
              };
            }
            return d;
          }).filter((item): item is ResourceDoc => item !== null);

          if (validated.length > 0) {
            return validated;
          }
        }
      }
    } catch (e) {
      console.error("Error reading downloads from localStorage:", e);
    }
    return INITIAL_RESOURCES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_testimonials");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (validateTestimonialSchema(parsed)) {
          const validated = parsed.map((t: any) => {
            const matched = TESTIMONIALS.find(it => it.id === t.id);
            if (matched) {
              return {
                ...matched,
                ...t
              };
            }
            return t;
          }).filter((item): item is Testimonial => item !== null);

          if (validated.length > 0) {
            return validated;
          }
        }
      }
    } catch (e) {
      console.error("Error reading testimonials from localStorage:", e);
    }
    return TESTIMONIALS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_gallery");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading gallery from localStorage:", e);
    }
    return INITIAL_GALLERY_ITEMS;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_team");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading team from localStorage:", e);
    }
    return INITIAL_TEAM_MEMBERS;
  });

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem("reefilm_settings");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading settings from localStorage:", e);
    }
    return INITIAL_SETTINGS;
  });

  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_applications");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading applications from localStorage:", e);
    }
    return APPLICATIONS;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem("reefilm_admin_users");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Error reading admin_users from localStorage:", e);
    }
    return INITIAL_ADMIN_USERS;
  });

  // Persist State modifications to LocalStorage and sync with Supabase Database
  useEffect(() => {
    try {
      localStorage.setItem("reefilm_leads", JSON.stringify(leads));
      syncLeads(leads);
    } catch (e) {
      console.error("Error writing leads to localStorage:", e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_products", JSON.stringify(products));
      syncProducts(products);
    } catch (e) {
      console.error("Error writing products to localStorage:", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_projects", JSON.stringify(projects));
      syncProjects(projects);
    } catch (e) {
      console.error("Error writing projects to localStorage:", e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_blogs", JSON.stringify(blogs));
      syncBlogs(blogs);
    } catch (e) {
      console.error("Error writing blogs to localStorage:", e);
    }
  }, [blogs]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_downloads", JSON.stringify(downloads));
      syncDownloads(downloads);
    } catch (e) {
      console.error("Error writing downloads to localStorage:", e);
    }
  }, [downloads]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_testimonials", JSON.stringify(testimonials));
      syncTestimonials(testimonials);
    } catch (e) {
      console.error("Error writing testimonials to localStorage:", e);
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_gallery", JSON.stringify(gallery));
      syncGallery(gallery);
    } catch (e) {
      console.error("Error writing gallery to localStorage:", e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_team", JSON.stringify(team));
      syncTeam(team);
    } catch (e) {
      console.error("Error writing team to localStorage:", e);
    }
  }, [team]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_settings", JSON.stringify(settings));
      syncSettings(settings);
    } catch (e) {
      console.error("Error writing settings to localStorage:", e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_admin_users", JSON.stringify(adminUsers));
      syncAdminUsers(adminUsers);
    } catch (e) {
      console.error("Error writing admin_users to localStorage:", e);
    }
  }, [adminUsers]);

  useEffect(() => {
    try {
      localStorage.setItem("reefilm_applications", JSON.stringify(applications));
      syncApplications(applications);
    } catch (e) {
      console.error("Error writing applications to localStorage:", e);
    }
  }, [applications]);

  // Synchronize ALL databases from Supabase on startup if configured (with local state fallback)
  useEffect(() => {
    const syncAllFromSupabase = async () => {
      try {
        // Attempt dynamic in-memory initialization of Supabase client using stored server credentials
        await initializeSupabaseDynamically();

        const [
          dbProducts,
          dbProjects,
          dbBlogs,
          dbDownloads,
          dbTestimonials,
          dbGallery,
          dbTeam,
          dbSettings,
          dbAdminUsers,
          dbLeads,
          dbApplications
        ] = await Promise.all([
          fetchProducts(products),
          fetchProjects(projects),
          fetchBlogs(blogs),
          fetchDownloads(downloads),
          fetchTestimonials(testimonials),
          fetchGallery(gallery),
          fetchTeam(team),
          fetchSettings(settings),
          fetchAdminUsers(adminUsers),
          fetchLeads(leads),
          fetchApplications(applications)
        ]);

        if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
        if (dbProjects && dbProjects.length > 0) setProjects(dbProjects);
        if (dbBlogs && dbBlogs.length > 0) setBlogs(dbBlogs);
        if (dbDownloads && dbDownloads.length > 0) setDownloads(dbDownloads);
        if (dbTestimonials && dbTestimonials.length > 0) setTestimonials(dbTestimonials);
        if (dbGallery && dbGallery.length > 0) setGallery(dbGallery);
        if (dbTeam && dbTeam.length > 0) setTeam(dbTeam);
        if (dbSettings) setSettings(dbSettings);
        if (dbAdminUsers && dbAdminUsers.length > 0) setAdminUsers(dbAdminUsers);
        if (dbLeads && dbLeads.length > 0) setLeads(dbLeads);
        if (dbApplications && dbApplications.length > 0) setApplications(dbApplications);
      } catch (err) {
        console.error("Failed to fetch startup databases from Supabase:", err);
      }
    };

    syncAllFromSupabase();
  }, []);

  // Handle addition of fresh leads
  const handleAddLead = async (newLead: any) => {
    const payload = {
      ...newLead,
      id: `lead-${Date.now()}`,
      status: "New",
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const result = await response.json();
        if (result.lead) {
          setLeads(prev => [result.lead, ...prev]);
          return result.lead;
        }
      }
    } catch (err) {
      console.error("Failed to post lead to backend database:", err);
    }

    // Local / Offline fallback
    setLeads(prev => [payload, ...prev]);
    return payload;
  };

  const handleSearchQuery = (query: string) => {
    setProductSearchTerm(query);
    setCurrentTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Newsletter Sign-up states
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col justify-between">
      
      {/* HEADER NAVBAR */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onSearch={handleSearchQuery} 
        settings={settings}
      />

      {/* BREADCRUMBS INDICATOR */}
      {currentTab !== "home" && (
        <div className="bg-neutral-950 border-b border-white/5 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
            <button onClick={() => setCurrentTab("home")} className="hover:text-white">Home</button>
            <ChevronRight className="w-3 h-3 text-red-500" />
            <span className="text-gray-300 font-bold">{currentTab}</span>
          </div>
        </div>
      )}

      {/* MAIN RENDER ENGINE */}
      <main className="flex-grow">
        
        {/* TAB 1: HOME PAGE */}
        {currentTab === "home" && (
          <div className="space-y-0 animate-in fade-in duration-500">
            {/* Immersive Hero */}
            <Hero setCurrentTab={setCurrentTab} settings={settings} />

            {/* Product Highlight Cards */}
            <section id="product-highlights" className="py-12 bg-black border-b border-white/5 relative z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Highlight 1: Transparency */}
                  <div className="bg-neutral-950 border border-white/5 hover:border-red-600/30 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Optical Clarity</div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">90–94%</div>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 font-mono">Transparency</div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Maintains maximum ambient light ingress and near-perfect optical views through architectural glass facades.
                    </p>
                  </div>

                  {/* Highlight 2: Brightness */}
                  <div className="bg-neutral-950 border border-white/5 hover:border-red-600/30 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Luminance Output</div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">4000 cd</div>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 font-mono">Active Brightness</div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Ensures premium high-contrast visual display legibility even under direct, high-street daylight exposure.
                    </p>
                  </div>

                  {/* Highlight 3: Thickness */}
                  <div className="bg-neutral-950 border border-white/5 hover:border-red-600/30 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Physical Profile</div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">2 mm</div>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 font-mono">Ultra-Thin Profile</div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Paper-thin structure that laminates seamlessly onto any existing storefront or partition glass without metal clutter.
                    </p>
                  </div>

                  {/* Highlight 4: Warranty */}
                  <div className="bg-neutral-950 border border-white/5 hover:border-red-600/30 p-6 rounded-2xl transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600/50 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Enterprise SLA</div>
                    <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">1-Year</div>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-2 font-mono">Comprehensive Warranty</div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Fully backed by local on-site calibration, swift parts exchange, and technical support from our Chennai desk.
                    </p>
                  </div>

                </div>
              </div>
            </section>

            {/* Premium Introduction Narrative */}
            <section className="py-20 bg-neutral-950 border-y border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">PROFESSIONAL PARTNERSHIP STATEMENT</span>
                    <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                      India's Premium Certified Solutions Provider
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      Reefilm India stands independent as the official Indian partner of REEFILM China, delivering advanced LED display solutions, installation, sales, and after-sales support throughout India.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      We strictly avoid copied templates or simulated claims. Our catalog boasts premium CE, RoHS, and FCC certified components built specifically to combat high-street UV exposure and extreme Indian summer temperatures.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => setCurrentTab("about")}
                        className="bg-white/5 hover:bg-white/10 border border-white/15 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all"
                      >
                        <span>Our Executive Story</span>
                        <ArrowRight className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Trust Showcase card */}
                  <div className="lg:col-span-5 border border-white/10 bg-black p-8 rounded-2xl relative overflow-hidden space-y-6">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/10 rounded-full blur-2xl" />
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">REEFILM SERVICE PROMISE</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3.5">
                        <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">1-Year Warranty</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">On-site technical inspection and swappable components within 24 hours.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bespoke CAD Blueprinting</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">Custom layouts, wind drag simulations, and exact structural weight alignment.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Lamination Calibration</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">Expert self-adhesive film application and driver integration by certified lamination technicians.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Reefilm China - Short Home Version */}
            <section className="py-16 bg-black border-b border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">ABOUT REEFILM CHINA</span>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight">
                      Global Precision <br />Manufacturing
                    </h2>
                    <div className="h-1 w-12 bg-red-600 rounded" />
                  </div>
                  <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-gray-400 leading-relaxed">
                    <p>
                      <strong>Reefilm China</strong> is a leading manufacturer of Transparent LED Film Display Solutions headquartered in Dongguan, Guangdong, China. Equipped with advanced cleanroom laboratories and state-of-the-art SMT lines, they pioneer the development of self-adhesive transparent visual displays.
                    </p>
                    <p>
                      <strong>Reefilm India</strong> is the Authorized Sales, Installation & Technical Support Partner for India, delivering premium transparent display technology for commercial buildings, retail stores, shopping malls, airports, hotels, restaurants, and corporate spaces.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Solutions Catalog Teaser */}
            <section className="py-20 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">DISCOVERY SUITE</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase tracking-tight">Reefilm India Solutions</h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">
                    Click any product to explore full technical spec tables and download comprehensive layout catalogs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.slice(0, 3).map((prod) => (
                    <div 
                      key={prod.id}
                      onClick={() => {
                        setSelectedProductForQuote(prod.name);
                        setCurrentTab("products");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="group border border-white/5 bg-neutral-950 p-6 rounded-2xl flex flex-col justify-between hover:border-white/15 transition-all cursor-pointer shadow-lg relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div className="aspect-[16/10] bg-neutral-900 rounded-xl overflow-hidden relative border border-white/5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono uppercase text-red-500 font-bold">
                            {prod.category}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-extrabold text-sm text-white group-hover:text-red-500 transition-colors leading-snug">{prod.name}</h3>
                          <p className="text-[11px] text-gray-400 leading-relaxed mt-2 line-clamp-3">{prod.description}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-[11px] font-mono text-gray-500">
                        <span>Material: {prod.specifications.pitch}</span>
                        <span className="text-red-500 font-bold group-hover:text-white transition-colors flex items-center gap-1">
                          View Specs <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Architectural Segments / Industry Verticals */}
            <section className="py-20 bg-neutral-950 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">SEGMENT TEASERS</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase tracking-tight">Designed For Landmark Spaces</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="border border-white/5 bg-black p-8 rounded-2xl relative group overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-6">
                      <ShoppingBag className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">Luxury Storefronts</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Transform standard retail windows into high-revenue digital ad screens using our ultra-thin, daylight-active self-adhesive LED film.</p>
                  </div>

                  <div className="border border-white/5 bg-black p-8 rounded-2xl relative group overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-6">
                      <Building2 className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">Corporate Headquarters</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Upgrade office lobbies and conference rooms with fine-pitch smart partitions that toggle instantly from clear glass to brilliant presentation screens.</p>
                  </div>

                  <div className="border border-white/5 bg-black p-8 rounded-2xl relative group overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-6">
                      <Landmark className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">Hospitality & Transit</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Integrate vibration-proof informational displays onto escalator glass balustrades, transit walkways, and terminal glass dividers.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Testimonials Carousel Teaser */}
            <section className="py-20 bg-black border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">CLIENT SATISFACTION</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase tracking-tight">Endorsed By Indian Leaders</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((t) => (
                    <div key={t.id} className="border border-white/10 bg-neutral-950 p-6 sm:p-8 rounded-2xl relative flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-xs italic text-gray-300 leading-relaxed">
                          \"{t.text}\"
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/5 mt-6 font-mono text-[11px] text-gray-500">
                        <span className="font-bold text-white block">{t.name}</span>
                        <span>{t.designation} • {t.company}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Trust and Partnership Section */}
            <section id="trust-partnership" className="py-16 bg-neutral-950 border-t border-b border-white/5 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Manufacturer Column */}
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">Global Manufacturer</span>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Reefilm China</h3>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        Pioneering transparent LED display development with state-of-the-art cleanroom laboratories, advanced automated SMT rows, and rigorous 72-hour stress-testing standards in Dongguan, China.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-red-500 font-bold border-t border-white/5 pt-3">
                      ✓ Factory-Direct Quality Control
                    </div>
                  </div>

                  {/* Authorized Partner Column */}
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">Authorized Partner</span>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Reefilm India</h3>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        The exclusive corporate logistics, sales, and localized technical support execution entity based in Chennai, delivering genuine factory warranties and seamless project management nationwide.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-red-500 font-bold border-t border-white/5 pt-3">
                      ✓ Exclusive Certified Distribution
                    </div>
                  </div>

                  {/* Services Column */}
                  <div className="bg-black/40 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">Our Services</span>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">Solutions & Delivery</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span className="font-bold">Sales</span>
                          <span className="text-gray-500">— Project consulting & custom sizing</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span className="font-bold">Installation</span>
                          <span className="text-gray-500">— Expert self-adhesive application</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                          <span className="font-bold">Technical Support</span>
                          <span className="text-gray-500">— 24h calibration & parts warranty</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-red-500 font-bold border-t border-white/5 pt-3 mt-4">
                      ✓ End-to-End Execution
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Newsletter Subscription */}
            <section className="py-16 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(227,6,19,0.03),transparent)]" />
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
                <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold block">MONTHLY BLUEPRINTS</span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Stay ahead of glass facade trends</h2>
                <p className="text-xs text-gray-400 max-w-lg mx-auto">
                  Subscribe to receive our architectural engineering catalogs, daylight compliance logs, and exclusive project discount offers directly from Raj Gupta's desk.
                </p>

                {newsletterSuccess ? (
                  <div className="max-w-md mx-auto bg-emerald-600/15 border border-emerald-500/30 p-4 rounded-xl text-xs text-emerald-400 font-mono flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Successfully subscribed! Thank you for subscribing to Reefilm India.</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter corporate email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-grow bg-black border border-white/10 rounded-lg px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: ABOUT US */}
        {currentTab === "about" && (
          <AboutView 
            setCurrentTab={setCurrentTab} 
            teamMembers={team}
            settings={settings}
          />
        )}

        {/* TAB 3: PRODUCTS */}
        {currentTab === "products" && (
          <ProductsView 
            setCurrentTab={setCurrentTab} 
            setSelectedProductForQuote={setSelectedProductForQuote} 
            searchTerm={productSearchTerm}
            setSearchTerm={setProductSearchTerm}
            products={products}
          />
        )}

        {/* TAB 4: APPLICATIONS */}
        {currentTab === "applications" && (
          <ApplicationsView setCurrentTab={setCurrentTab} applications={applications} products={products} />
        )}

        {/* TAB 5: PROJECTS */}
        {currentTab === "projects" && (
          <ProjectsView setCurrentTab={setCurrentTab} projects={projects} />
        )}

        {/* TAB 6: GALLERY */}
        {currentTab === "gallery" && (
          <GalleryView galleryItems={gallery} />
        )}

        {/* TAB 7: RESOURCES */}
        {currentTab === "resources" && (
          <ResourcesView downloads={downloads} />
        )}

        {/* TAB 8: BLOG */}
        {currentTab === "blog" && (
          <BlogView blogs={blogs} />
        )}

        {/* TAB 9: CONTACT */}
        {currentTab === "contact" && (
          <ContactView onAddLead={handleAddLead} />
        )}

        {/* TAB 10: REQUEST QUOTE */}
        {currentTab === "quote" && (
          <QuoteView 
            onAddLead={handleAddLead} 
            selectedProduct={selectedProductForQuote} 
          />
        )}

        {/* TAB 11: ADMIN PANEL */}
        {currentTab === "admin" && (
          <AdminDashboard 
            products={products}
            projects={projects}
            blogs={blogs}
            downloads={downloads}
            testimonials={testimonials}
            leads={leads}
            galleryItems={gallery}
            teamMembers={team}
            settings={settings}
            adminUsers={adminUsers}
            applications={applications}
            onUpdateLeads={setLeads}
            onUpdateProducts={setProducts}
            onUpdateProjects={setProjects}
            onUpdateBlogs={setBlogs}
            onUpdateDownloads={setDownloads}
            onUpdateTestimonials={setTestimonials}
            onUpdateGalleryItems={setGallery}
            onUpdateTeamMembers={setTeam}
            onUpdateSettings={setSettings}
            onUpdateAdminUsers={setAdminUsers}
            onUpdateApplications={setApplications}
          />
        )}

      </main>

      {/* FOOTER SECTION */}
      <Footer setCurrentTab={setCurrentTab} settings={settings} />

      {/* FLOATING ACTION OVERLAYS */}
      <FloatingActions />

    </div>
  );
}
