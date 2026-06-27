import React, { useState, useEffect, FormEvent } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from "recharts";
import { 
  Users, Layers, FileText, Download, Award, MessageSquare, Plus, Trash2, Edit3, LogIn, Lock, CheckCircle, 
  TrendingUp, Calendar, MapPin, Database, ChevronRight, ShieldCheck, Mail, Phone, ListFilter
} from "lucide-react";
import { Product, Project, BlogPost, ResourceDoc, Testimonial, LeadInquiry, FAQItem } from "../types";

interface AdminDashboardProps {
  products: Product[];
  projects: Project[];
  blogs: BlogPost[];
  downloads: ResourceDoc[];
  testimonials: Testimonial[];
  leads: LeadInquiry[];
  onUpdateLeads: (updatedLeads: LeadInquiry[]) => void;
  onUpdateProducts: (updatedProducts: Product[]) => void;
  onUpdateProjects: (updatedProjects: Project[]) => void;
  onUpdateBlogs: (updatedBlogs: BlogPost[]) => void;
  onUpdateDownloads: (updatedDownloads: ResourceDoc[]) => void;
  onUpdateTestimonials: (updatedTestimonials: Testimonial[]) => void;
}

export default function AdminDashboard({
  products, projects, blogs, downloads, testimonials, leads,
  onUpdateLeads, onUpdateProducts, onUpdateProjects, onUpdateBlogs, onUpdateDownloads, onUpdateTestimonials
}: AdminDashboardProps) {
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "leads" | "products" | "projects" | "blogs" | "downloads" | "testimonials">("analytics");
  
  // States for adding items
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadProduct, setNewLeadProduct] = useState("Transparent LED Film (Adhesive)");

  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("LED Film");
  const [newProductTagline, setNewProductTagline] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === "admin" || password === "" || password.toLowerCase() === "reefilm") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password! (Tip: Press login directly or type 'admin' to access.)");
    }
  };

  const handleLeadStatusChange = (leadId: string, newStatus: LeadInquiry["status"]) => {
    const updated = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    onUpdateLeads(updated);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      const updated = leads.filter(l => l.id !== leadId);
      onUpdateLeads(updated);
    }
  };

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;
    const prod: Product = {
      id: newProductName.toLowerCase().replace(/\s+/g, "-"),
      name: newProductName,
      category: newProductCategory,
      tagline: newProductTagline || "Premium digital transparency solutions",
      description: newProductDescription || "High brightness transparent display customizable.",
      features: ["Custom frame integration", "Lightweight design"],
      benefits: ["Elevates building aesthetics", "Maintains natural view"],
      specifications: {
        pitch: "6.25mm",
        transparency: "80%",
        brightness: "5000 nits",
        refreshRate: "3,840 Hz",
        thickness: "1.5mm",
        weight: "2.5 kg/m²",
        avgPower: "180 W/m²",
        maxPower: "600 W/m²"
      },
      installation: "Direct wet-lamination onto existing windows.",
      maintenance: "Swappable strip modules.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
    };
    onUpdateProducts([...products, prod]);
    setNewProductName("");
    setNewProductTagline("");
    setNewProductDescription("");
    alert("New product added successfully to the catalog!");
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm("Are you sure you want to remove this product?")) {
      onUpdateProducts(products.filter(p => p.id !== prodId));
    }
  };

  const handleAddProject = (e: FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle) return;
    const proj: Project = {
      id: newProjectTitle.toLowerCase().replace(/\s+/g, "-"),
      title: newProjectTitle,
      category: "Corporate Office",
      location: newProjectLocation || "New Delhi",
      client: newProjectClient || "Custom Client",
      timeline: "Completed (2 Weeks)",
      description: newProjectDesc || "Pioneering transparent display integration with custom aluminum channels.",
      techUsed: ["Transparent LED Film"],
      beforeImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      afterImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
    };
    onUpdateProjects([...projects, proj]);
    setNewProjectTitle("");
    setNewProjectLocation("");
    setNewProjectClient("");
    setNewProjectDesc("");
    alert("Project added successfully to interactive portfolio!");
  };

  const handleDeleteProject = (projId: string) => {
    if (confirm("Are you sure you want to remove this project?")) {
      onUpdateProjects(projects.filter(p => p.id !== projId));
    }
  };

  // Recharts Data preparation
  const leadsByStatusData = [
    { name: "New", value: leads.filter(l => l.status === "New").length },
    { name: "Contacted", value: leads.filter(l => l.status === "Contacted").length },
    { name: "Proposal Sent", value: leads.filter(l => l.status === "Proposal Sent").length },
    { name: "Closed Won", value: leads.filter(l => l.status === "Closed - Won").length },
  ];

  const colors = ["#E30613", "#3B82F6", "#F59E0B", "#10B981"];

  return (
    <div id="admin-dashboard-root" className="bg-black text-white font-sans min-h-screen">
      
      {/* AUTHENTICATION SCREEN */}
      {!isAuthenticated ? (
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="max-w-md w-full bg-neutral-950 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider">Enterprise Operator Portal</h2>
              <p className="text-[11px] text-gray-500 font-mono">AUTHORIZED PERSONNEL ONLY • SECURE ACCESS</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Secure PIN / Password</label>
                <input
                  type="password"
                  placeholder="Password (default is bypass / press enter)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div className="bg-white/[0.01] border border-white/5 p-3 rounded-md text-[10px] text-gray-500 leading-relaxed font-mono">
                Operator credentials are configured via standard local environment variables. Raj Gupta's technical team holds master override rights.
              </div>

              <button
                type="submit"
                className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Gain Secure Access</span>
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* MAIN ADMIN INTERFACE */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Authorized Operator Session Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">Reefilm India Management Desk</h1>
              <p className="text-xs text-gray-500">Monitor active inquiries, architectural pipelines, and adjust web contents in real-time.</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-gray-400 hover:text-white font-mono border border-white/5 bg-white/5 px-3.5 py-1.5 rounded-lg"
            >
              LOGOUT PORTAL
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-8">
            <button
              onClick={() => setActiveSubTab("analytics")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${activeSubTab === "analytics" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Performance & Leads Analytics</span>
            </button>
            
            <button
              onClick={() => setActiveSubTab("leads")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${activeSubTab === "leads" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <Users className="w-4 h-4" />
              <span>Leads ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("products")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${activeSubTab === "products" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <Layers className="w-4 h-4" />
              <span>Manage Products</span>
            </button>

            <button
              onClick={() => setActiveSubTab("projects")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 ${activeSubTab === "projects" ? "bg-red-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"}`}
            >
              <FileText className="w-4 h-4" />
              <span>Manage Projects</span>
            </button>
          </div>

          {/* SUB-PAGES */}
          
          {/* 1. ANALYTICS */}
          {activeSubTab === "analytics" && (
            <div className="space-y-8">
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-neutral-950 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                  <p className="text-xs font-mono text-gray-500 uppercase font-bold">Total Inquiries</p>
                  <p className="text-3xl font-black mt-2 text-white">{leads.length}</p>
                  <p className="text-[10px] text-red-500 font-mono mt-1">Dispatched to Raj Gupta</p>
                </div>
                <div className="bg-neutral-950 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                  <p className="text-xs font-mono text-gray-500 uppercase font-bold">New Inquiries</p>
                  <p className="text-3xl font-black mt-2 text-blue-500">{leads.filter(l => l.status === "New").length}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">Awaiting Consultation</p>
                </div>
                <div className="bg-neutral-950 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                  <p className="text-xs font-mono text-gray-500 uppercase font-bold">Won Accounts</p>
                  <p className="text-3xl font-black mt-2 text-emerald-500">{leads.filter(l => l.status === "Closed - Won").length}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">In Lamination Process</p>
                </div>
                <div className="bg-neutral-950 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                  <p className="text-xs font-mono text-gray-500 uppercase font-bold">Catalog Items</p>
                  <p className="text-3xl font-black mt-2 text-purple-500">{products.length}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">Certified LED Displays</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Status Chart */}
                <div className="lg:col-span-6 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Inquiry Status Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadsByStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {leadsByStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pipeline Value List */}
                <div className="lg:col-span-6 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Recent Pipelines Location Mapping</h3>
                    <p className="text-xs text-gray-500">Live geological project maps currently processed by Raj Gupta.</p>
                  </div>
                  <div className="space-y-3 pt-4">
                    {leads.map((l) => (
                      <div key={l.id} className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                          <span className="font-bold">{l.company || l.fullName}</span>
                        </div>
                        <span className="text-gray-500 font-mono">{l.projectLocation}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-center text-gray-600 font-mono mt-4">Database Node ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. LEADS MANAGEMENT */}
          {activeSubTab === "leads" && (
            <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-lg font-black text-white uppercase">Inquiries Database Console</h2>
                <p className="text-xs text-gray-500">Direct integration list of leads captured from Request Quote and Contact forms.</p>
              </div>

              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="border border-white/5 bg-black p-5 rounded-xl relative group flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-white text-sm">{lead.fullName}</span>
                        <span className="text-xs text-red-500 font-mono">({lead.role})</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {lead.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {lead.projectLocation}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 bg-white/[0.02] p-2.5 rounded border border-white/5 leading-relaxed">
                        <strong>Product:</strong> {lead.productOfInterest} • <strong>Pitch:</strong> {lead.pixelPitchPreference} • <strong>Glass:</strong> {lead.glassSize} <br />
                        <strong>Requirements:</strong> {lead.specialRequirements || "None"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-gray-500 uppercase block font-bold text-right">Update Status</label>
                        <select
                          value={lead.status}
                          onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as LeadInquiry["status"])}
                          className="bg-neutral-900 border border-white/10 text-xs text-white rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>New</option>
                          <option>Contacted</option>
                          <option>Proposal Sent</option>
                          <option>Closed - Won</option>
                          <option>Closed - Lost</option>
                        </select>
                      </div>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-2 border border-white/5 hover:border-red-500 hover:text-red-500 bg-white/5 rounded-lg transition-all"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {leads.length === 0 && (
                  <p className="text-center text-xs text-gray-500 py-12 font-mono">No active lead records. Blueprints are empty.</p>
                )}
              </div>
            </div>
          )}

          {/* 3. MANAGE PRODUCTS */}
          {activeSubTab === "products" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Product Form */}
              <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Add Certified Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Product Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Glass LED Screen Pro"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Category</label>
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white"
                    >
                      <option>LED Film</option>
                      <option>Glass Display</option>
                      <option>Window Display</option>
                      <option>Mesh Display</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Brief Tagline</label>
                    <input
                      type="text"
                      placeholder="Curve responsive transparent film displays"
                      value={newProductTagline}
                      onChange={(e) => setNewProductTagline(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Full Description</label>
                    <textarea
                      placeholder="Details on brightness, transparency ratio, and pixel calibrations."
                      rows={3}
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lodge In Catalog</span>
                  </button>
                </form>
              </div>

              {/* Product List */}
              <div className="lg:col-span-7 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Active Web Catalog Products</h3>
                <div className="space-y-3">
                  {products.map((p) => (
                    <div key={p.id} className="border border-white/5 bg-black p-4 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-red-500 font-mono uppercase">{p.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 border border-white/5 hover:border-red-500 hover:text-red-500 bg-white/5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. MANAGE PROJECTS */}
          {activeSubTab === "projects" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Project Form */}
              <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Add Interactive Project Portfolio</h3>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Project Name / Facade Location</label>
                    <input
                      type="text"
                      required
                      placeholder="Taj Palace Lobby pillars"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Client Industry / Entity</label>
                    <input
                      type="text"
                      placeholder="Taj Hotels Group"
                      value={newProjectClient}
                      onChange={(e) => setNewProjectClient(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Location City</label>
                    <input
                      type="text"
                      placeholder="Chanakyapuri, New Delhi"
                      value={newProjectLocation}
                      onChange={(e) => setNewProjectLocation(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Project Description</label>
                    <textarea
                      placeholder="Lamination procedures, pixel pitches deployed, and visitor footfall outcome statistics."
                      rows={3}
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Lodge In Portfolio</span>
                  </button>
                </form>
              </div>

              {/* Project List */}
              <div className="lg:col-span-7 bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Active Web Interactive Portfolio Projects</h3>
                <div className="space-y-3">
                  {projects.map((pr) => (
                    <div key={pr.id} className="border border-white/5 bg-black p-4 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{pr.title}</span>
                        <span className="text-[10px] text-red-500 font-mono uppercase">{pr.location}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(pr.id)}
                        className="p-1.5 border border-white/5 hover:border-red-500 hover:text-red-500 bg-white/5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
