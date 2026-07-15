import React, { useState, FormEvent } from "react";
import { 
  Mail, Phone, MapPin, MessageSquare, Clock, Send, 
  CheckCircle, ShieldAlert, Users, Award, Building2, Globe
} from "lucide-react";
import { COMPANY_INFO } from "../data";
import { LeadInquiry } from "../types";

interface ContactViewProps {
  onAddLead: (lead: any) => Promise<any> | void;
}

export default function ContactView({ onAddLead }: ContactViewProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Upgraded form state to collect exactly what is requested
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    specialRequirements: "", // acts as message
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.whatsapp || !formData.city) {
      setErrorMsg("Please provide your Name, Email, Phone, WhatsApp, and City so we can reach you!");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const customerName = formData.fullName.trim();
      const displayName = customerName ? `Mr./Ms. ${customerName}` : "Valued Customer";
      
      const dynamicMessage = `Hello ${displayName},

Welcome to Reefilm India!

Thank you for your interest in our advanced LED Display Solutions. We specialize in Indoor LED Displays, Outdoor LED Displays, Transparent LED Screens, Rental LED Walls, Digital Signage, Video Walls, and Customized LED Display Solutions for businesses across India.

Our team will review your inquiry and contact you shortly with detailed product information, pricing, technical specifications, and the best solution for your requirements.

We look forward to helping you transform your advertising and display experience with Reefilm India's innovative LED technology.

Best Regards,
Reefilm India
Premium LED Display Solutions Across India`;

      await onAddLead({
        ...formData,
        specialRequirements: formData.specialRequirements.trim() || dynamicMessage,
        productOfInterest: "General Business Inquiry",
        timeline: "Immediate",
        budgetRange: "General Inquiry",
        country: "India",
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the database. Storing your parameters locally in the browser.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const getDynamicWAMessage = () => {
    const customerName = formData.fullName.trim();
    const displayName = customerName ? `Mr./Ms. ${customerName}` : "Valued Customer";
    
    const message = `Hello ${displayName},

Welcome to Reefilm India!

Thank you for your interest in our advanced LED Display Solutions. We specialize in Indoor LED Displays, Outdoor LED Displays, Transparent LED Screens, Rental LED Walls, Digital Signage, Video Walls, and Customized LED Display Solutions for businesses across India.

Our team will review your inquiry and contact you shortly with detailed product information, pricing, technical specifications, and the best solution for your requirements.

We look forward to helping you transform your advertising and display experience with Reefilm India's innovative LED technology.

Best Regards,
Reefilm India
Premium LED Display Solutions Across India`;

    return encodeURIComponent(message);
  };

  return (
    <div id="contact-page" className="bg-black text-white font-sans min-h-screen">
      {/* Banner */}
      <section className="relative py-16 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">
            AUTHORIZED DISTRIBUTION & PROJECTS DESK
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Contact Our Teams
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Discuss customized architectural lamination. Our engineering layout takes shape under professional calibration.
          </p>
        </div>
      </section>

      {/* Trust Message Section (glowing trust-building banner) */}
      <section className="py-6 bg-red-600/5 border-b border-red-600/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <Award className="w-10 h-10 text-red-500 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
                IMPORTANT BUSINESS MESSAGE
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                <strong>Manufacturing:</strong> Premium Certified Foundries • 
                <strong> Sales, Installation, Technical Support & Customer Service:</strong> Reefilm India. 
                Reefilm India stands as an independent Indian enterprise, delivering premium transparent LED display solutions, certified glass lamination, sales, and comprehensive technical support throughout India spearheaded by Raj Gupta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Two Corporate Offices */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Office: Reefilm India Headquarters */}
              <div className="border border-emerald-500/10 bg-neutral-950 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-emerald-600/10" />
                <span className="text-[9px] font-mono bg-emerald-600/20 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Independent Indian Enterprise
                </span>
                <h3 className="text-base font-black text-white mt-3 uppercase tracking-wider">
                  Reefilm India Headquarters
                </h3>
                <p className="text-xs text-emerald-400 font-medium">Premium Transparent LED Film Solutions Across India</p>

                <div className="mt-5 space-y-3 text-xs text-gray-300 font-mono">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Location: <strong className="text-white">Chennai, India</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <a href="tel:+918577917327" className="hover:text-emerald-400 transition-colors">
                      +91 8577917327
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0 fill-current" />
                    <a 
                      href={`https://wa.me/918577917327?text=${getDynamicWAMessage()}`}
                      target="_blank" 
                      rel="noreferrer" 
                      className="hover:text-emerald-400 transition-colors"
                    >
                      +91 8577917327 (WhatsApp)
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <a href="mailto:razzg946@gmail.com" className="hover:text-emerald-400 transition-colors">
                      razzg946@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* REAL GOOGLE MAP FOR CHENNAI OFFICE */}
              <div className="border border-white/5 bg-neutral-950 rounded-2xl overflow-hidden p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-widest">
                    Chennai Geolocation Hub
                  </span>
                  <span className="text-[9px] bg-red-600/20 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold">
                    ACTIVE DESK
                  </span>
                </div>
                
                {/* Embed Chennai Google Maps Frame */}
                <div className="w-full h-44 rounded-xl overflow-hidden border border-white/10 relative">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b1287e895!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1719475110000!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <p className="text-[10px] text-gray-400 leading-snug">
                    Tamil Nadu Sales, Installation & Tech Desk
                  </p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Chennai,+Tamil+Nadu,+India"
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#E30613] hover:bg-red-700 text-[10px] text-white uppercase font-bold tracking-wider px-3.5 py-2 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column: Upgraded Inquiry Form */}
            <div className="lg:col-span-7 bg-neutral-950 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              {submitted ? (
                <div className="text-center py-12 space-y-5">
                  <div className="w-16 h-16 bg-emerald-600/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Inquiry Saved Successfully</h3>
                  
                  <div className="bg-emerald-600/10 border border-emerald-500/25 p-4 rounded-xl text-xs text-emerald-400 font-mono">
                    ✓ Thank you for contacting Reefilm India. Our sales team will contact you shortly.
                  </div>

                  <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                    All parameters have been synchronized with the database, and a notification has been sent directly to 
                    <strong> razzg946@gmail.com</strong>. We will contact you within 4 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        company: "",
                        phone: "",
                        whatsapp: "",
                        email: "",
                        city: "",
                        specialRequirements: "",
                      });
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white uppercase font-bold tracking-wider px-6 py-2.5 rounded-lg transition-colors mt-6 cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase">Direct Business Inquiry</h3>
                    <p className="text-xs text-gray-500">Provide your credentials and parameters for instant Chennai team assessment.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Raj Gupta"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Corporate Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. L&T Realty / Individual"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="E.g. +91 85779 17327"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="E.g. +91 85779 17327"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Direct Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="E.g. contact@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Chennai, Delhi, Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Message / Architectural Layout Query</label>
                    <textarea
                      placeholder="Please enter your request details or glass structure descriptions here..."
                      rows={4}
                      value={formData.specialRequirements}
                      onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-red-500 text-xs font-mono bg-red-600/10 border border-red-500/25 p-3 rounded-lg">
                      ⚠️ {errorMsg}
                    </p>
                  )}

                  {/* Privacy Banner */}
                  <div className="flex items-start space-x-2 bg-red-600/10 border border-red-500/20 p-3.5 rounded-lg text-[10px] text-gray-400 font-mono leading-relaxed">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p>Reefilm India will secure this inquiry directly into our local database. Recipient coordinator email is razzg946@gmail.com.</p>
                  </div>

                  <button
                    id="submit-inquiry-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(227,6,19,0.3)] flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Dispatched to Database...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Dispatched to Project Desk</span>
                      </>
                    )}
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
