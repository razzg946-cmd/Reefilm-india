import React, { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, MessageSquare, Clock, Send, CheckCircle, ShieldAlert } from "lucide-react";
import { COMPANY_INFO } from "../data";
import { LeadInquiry } from "../types";

interface ContactViewProps {
  onAddLead: (lead: Omit<LeadInquiry, "id" | "status" | "createdAt">) => void;
}

export default function ContactView({ onAddLead }: ContactViewProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    productOfInterest: "Transparent LED Film (Adhesive)",
    pixelPitchPreference: "6.25mm",
    glassSize: "",
    projectLocation: "",
    timeline: "Next 3 Months",
    budgetRange: "₹15L - ₹25L",
    specialRequirements: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please provide at least your Name, Email, and Phone so Raj Gupta's team can reach you!");
      return;
    }
    onAddLead({
      ...formData,
    });
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="bg-black text-white font-sans min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">DIRECT COOPERATION</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Contact Reefilm India</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Book an on-site structural mock lamination test or discuss your upcoming double-height facade glass budget.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Business Info & Vector Map */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-mono text-red-500 uppercase tracking-widest block font-bold font-mono">HEAD OFFICE INFORMATION</span>
                <h2 className="text-2xl font-black text-white mt-1">Visit our Gurugram Design Studio</h2>
              </div>

              {/* Info Block */}
              <div className="space-y-6 bg-neutral-950 border border-white/5 p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Registered Address</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Direct Email</h4>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-xs text-red-400 hover:text-red-300 transition-colors mt-1 block">{COMPANY_INFO.email}</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Mobile Consultation Desk</h4>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="text-xs text-gray-300 hover:text-white transition-colors mt-1 block">{COMPANY_INFO.phone}</a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Operational Hours (IST)</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">{COMPANY_INFO.hours}</p>
                  </div>
                </div>
              </div>

              {/* Vector Map Placeholder - Beautiful interactive component */}
              <div className="border border-white/10 bg-gradient-to-tr from-neutral-950 to-neutral-900 rounded-2xl p-6 relative overflow-hidden h-60 flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(227,6,19,0.08),transparent)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:15px_15px] opacity-40" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-red-500 font-bold uppercase">GURUGRAM GEOLOCATION RADAR</span>
                  <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    CYBERCITY SECTOR 24
                  </span>
                </div>

                <div className="relative z-10 my-auto text-center space-y-2">
                  <div className="w-4 h-4 bg-red-600 rounded-full mx-auto animate-ping absolute left-1/2 -translate-x-1/2" />
                  <div className="w-4 h-4 bg-red-600 rounded-full mx-auto border-2 border-white relative" />
                  <p className="text-xs font-bold text-white tracking-wider">REEFILM INDIA EXPERIENCE SUITE</p>
                  <p className="text-[10px] text-gray-500 font-mono">Latitude: 28.4950° N • Longitude: 77.0898° E</p>
                </div>

                <div className="relative z-10 text-center">
                  <p className="text-[10px] text-gray-500 leading-snug">Authorized Sales and Technical Support HQ</p>
                </div>
              </div>
            </div>

            {/* Right Column: Modern Inquiry Form */}
            <div className="lg:col-span-7 bg-neutral-950 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-600/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Inquiry Lodged Successfully!</h3>
                  <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting Reefilm India. Your project parameters have been securely saved and dispatched directly to <strong>Raj Gupta's project desk</strong>. We will review your CAD specs and contact you within 4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        company: "",
                        role: "",
                        productOfInterest: "Transparent LED Film (Adhesive)",
                        pixelPitchPreference: "6.25mm",
                        glassSize: "",
                        projectLocation: "",
                        timeline: "Next 3 Months",
                        budgetRange: "₹15L - ₹25L",
                        specialRequirements: "",
                      });
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white uppercase font-bold tracking-wider px-6 py-2.5 rounded-lg transition-colors mt-6"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white">Direct Business Inquiry Form</h3>
                    <p className="text-xs text-gray-500">Provide your structural metrics below to receive a free mock-up budget sheet.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Raj Gupta"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Direct Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Active Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 99887 76655"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Corporate Company / Builder Name</label>
                      <input
                        type="text"
                        placeholder="L&T Realty / DLF Offices"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Primary Product Preference</label>
                      <select
                        value={formData.productOfInterest}
                        onChange={(e) => setFormData({ ...formData, productOfInterest: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      >
                        <option>Transparent LED Film (Adhesive)</option>
                        <option>Flexible LED Film (Curved Surfaces)</option>
                        <option>Structural Glass LED Display</option>
                        <option>Street-Facing Window LED Display</option>
                        <option>Architectural LED Curtain Mesh</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Target Location (City / State)</label>
                      <input
                        type="text"
                        placeholder="Mumbai, New Delhi, Bengaluru"
                        value={formData.projectLocation}
                        onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Specific Architectural Requirements / Glass Size</label>
                    <textarea
                      placeholder="E.g. double-height glass lobby, curved pillar columns. Total glass size: 10m x 3m."
                      rows={4}
                      value={formData.specialRequirements}
                      onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  {/* Warning banner */}
                  <div className="flex items-start space-x-2 bg-red-600/10 border border-red-500/20 p-3.5 rounded-lg text-[10px] text-gray-400 font-mono">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p>Reefilm India will never share your structural CAD blueprints or corporate metrics with unauthorized entities.</p>
                  </div>

                  <button
                    id="submit-inquiry-btn"
                    type="submit"
                    className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(227,6,19,0.3)] flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatched to Project Desk</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
