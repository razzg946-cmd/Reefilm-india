import React, { useState, useEffect, FormEvent } from "react";
import { 
  INITIAL_PRODUCTS, INITIAL_PROJECTS, INITIAL_BLOG_POSTS, INITIAL_RESOURCES, TESTIMONIALS, INITIAL_LEADS 
} from "./data";
import { Product, Project, BlogPost, ResourceDoc, Testimonial, LeadInquiry } from "./types";

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
import CookieBanner from "./components/CookieBanner";
import FloatingActions from "./components/FloatingActions";

import { 
  Building2, ShoppingBag, Landmark, ArrowRight, Star, ShieldAlert, CheckCircle2, 
  Lightbulb, ChevronRight, Award, Zap, ShieldCheck 
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<string>("");

  // Reactive State databases
  const [leads, setLeads] = useState<LeadInquiry[]>(() => {
    const saved = localStorage.getItem("reefilm_leads");
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("reefilm_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("reefilm_projects");
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem("reefilm_blogs");
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [downloads, setDownloads] = useState<ResourceDoc[]>(() => {
    const saved = localStorage.getItem("reefilm_downloads");
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem("reefilm_testimonials");
    return saved ? JSON.parse(saved) : TESTIMONIALS;
  });

  // Persist State modifications
  useEffect(() => {
    localStorage.setItem("reefilm_leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("reefilm_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("reefilm_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("reefilm_blogs", JSON.stringify(blogs));
  }, [blogs]);

  useEffect(() => {
    localStorage.setItem("reefilm_downloads", JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem("reefilm_testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  // Handle addition of fresh leads
  const handleAddLead = (newLead: Omit<LeadInquiry, "id" | "status" | "createdAt">) => {
    const lead: LeadInquiry = {
      ...newLead,
      id: `lead-${Date.now()}`,
      status: "New",
      createdAt: new Date().toISOString()
    };
    setLeads(prev => [lead, ...prev]);
  };

  const handleSearchQuery = (query: string) => {
    alert(`Searching for: "${query}" across Reefilm India databases... Routing to Products for match catalogs.`);
    setCurrentTab("products");
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
            <Hero setCurrentTab={setCurrentTab} />

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
                      Reefilm India stands independent as the authorized, trusted engineering and sales integration partner for world-leading transparent display developers. Spearheaded by <strong>Raj Gupta</strong>, we deliver flawless project execution, CAD spatial layouts, bespoke metal support channels, and premium localized lamination calibration.
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
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">3-Year On-Site Guarantee</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">On-site technical inspection and swappable components within 24 hours.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bespoke CAD蓝图 Blueprinting</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">Custom layouts, wind drag simulations, and exact pixel matrix alignment.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bubble-Free Wet Lamination</h4>
                          <p className="text-[10px] text-gray-400 mt-1 leading-normal">Expert lamination by specialized, certified installers on existing structural glass.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Hardware Catalog Teaser */}
            <section className="py-20 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">DISCOVERY SUITE</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase tracking-tight">Pioneering Hardware Solutions</h2>
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
                        <span>Pitch: {prod.specifications.pitch}</span>
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
                    <p className="text-xs text-gray-400 leading-relaxed">Attract high-street pedestrian foot traffic through brilliant 3D holographic watch or shoe animations projected seamlessly on see-through window panes.</p>
                  </div>

                  <div className="border border-white/5 bg-black p-8 rounded-2xl relative group overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-6">
                      <Building2 className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">Corporate Headquarters</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Upgrade entrance lobbies and atrium windows with glass display films, showing corporate success milestones while preserving complete natural daylight.</p>
                  </div>

                  <div className="border border-white/5 bg-black p-8 rounded-2xl relative group overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mb-6">
                      <Landmark className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">Hospitality & Dining</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">Wrap glass elevator structures, staircases, and cylindrical pillars in slow cascading water animations, leaving hotel guests utterly spellbound.</p>
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
                    <span>Lodge successfully! Thank you for subscribing to Reefilm India.</span>
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
          <AboutView setCurrentTab={setCurrentTab} />
        )}

        {/* TAB 3: PRODUCTS */}
        {currentTab === "products" && (
          <ProductsView 
            setCurrentTab={setCurrentTab} 
            setSelectedProductForQuote={setSelectedProductForQuote} 
          />
        )}

        {/* TAB 4: APPLICATIONS */}
        {currentTab === "applications" && (
          <ApplicationsView setCurrentTab={setCurrentTab} />
        )}

        {/* TAB 5: PROJECTS */}
        {currentTab === "projects" && (
          <ProjectsView setCurrentTab={setCurrentTab} />
        )}

        {/* TAB 6: GALLERY */}
        {currentTab === "gallery" && (
          <GalleryView />
        )}

        {/* TAB 7: RESOURCES */}
        {currentTab === "resources" && (
          <ResourcesView />
        )}

        {/* TAB 8: BLOG */}
        {currentTab === "blog" && (
          <BlogView />
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
            onUpdateLeads={setLeads}
            onUpdateProducts={setProducts}
            onUpdateProjects={setProjects}
            onUpdateBlogs={setBlogs}
            onUpdateDownloads={setDownloads}
            onUpdateTestimonials={setTestimonials}
          />
        )}

      </main>

      {/* FOOTER SECTION */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* FLOATING ACTION OVERLAYS */}
      <FloatingActions />
      <CookieBanner />

    </div>
  );
}
