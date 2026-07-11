import { Mail, Phone, MapPin, MessageSquare, ShieldCheck, ArrowRight, Linkedin, Twitter, Facebook, Award } from "lucide-react";
import { COMPANY_INFO } from "../data";
import { WebsiteSettings } from "../types";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  settings?: WebsiteSettings;
}

export default function Footer({ setCurrentTab, settings }: FooterProps) {
  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  // Prefilled WhatsApp message parameters as requested
  const waMessage = encodeURIComponent(
    "Hello Reefilm India,\n\nI am interested in Premium self-adhesive Transparent LED Film Displays.\n\nPlease send me more information."
  );

  return (
    <footer id="footer-section" className="bg-black border-t border-white/10 text-gray-400 font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand and Description (Col span: 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick("home")}>
              {settings?.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt={settings.companyName || "Reefilm India"} 
                  className="h-8 w-auto object-contain rounded" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-tr from-red-600 to-black rounded flex items-center justify-center border border-red-500/20 shadow-[0_0_10px_rgba(227,6,19,0.2)]">
                  <span className="text-white font-black text-base">R</span>
                </div>
              )}
              <span className="text-white font-black text-base tracking-wider uppercase">
                {settings?.companyName ? (
                  <>
                    {settings.companyName.split(" ")[0]}
                    {settings.companyName.split(" ").slice(1).length > 0 && (
                      <span className="text-red-600 font-bold ml-1">
                        {settings.companyName.split(" ").slice(1).join(" ")}
                      </span>
                    )}
                  </>
                ) : (
                  <>REEFILM <span className="text-red-600 font-bold">INDIA</span></>
                )}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              {settings?.tagline ? `${settings.tagline}. ` : "Premium LED Display Solutions Across India. "}
              Reefilm India is the official Indian partner of REEFILM China, delivering advanced LED display solutions, installation, sales, and after-sales support throughout India.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-gray-500 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-md w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Exclusive Authorized Technical Partner</span>
            </div>
            <div className="flex space-x-3 pt-1">
              <a href={settings?.linkedinUrl || "https://linkedin.com"} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href={settings?.facebookUrl || "https://facebook.com"} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (Col span: 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4 font-mono">Quick Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNavClick("products")} className="hover:text-white hover:translate-x-1 transition-all flex items-center text-left cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("applications")} className="hover:text-white hover:translate-x-1 transition-all flex items-center text-left cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Applications
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("projects")} className="hover:text-white hover:translate-x-1 transition-all flex items-center text-left cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Projects Showcase
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("gallery")} className="hover:text-white hover:translate-x-1 transition-all flex items-center text-left cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Photo & Video Gallery
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("resources")} className="hover:text-white hover:translate-x-1 transition-all flex items-center text-left cursor-pointer">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Downloads Center
                </button>
              </li>
            </ul>
          </div>

          {/* PIONEER INDIA - CHENNAI (Col span: 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              {settings?.companyName ? `${settings.companyName} - India` : COMPANY_INFO.indiaOffice.title}
            </h3>
            <p className="text-[10px] text-gray-500 leading-snug">
              Authorized Sales, Distribution & Technical Support Partner
            </p>
            <ul className="space-y-2.5 text-xs font-mono">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-sans text-gray-400 text-[11px]">{settings?.address || COMPANY_INFO.indiaOffice.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <a href={`tel:${settings?.phone || COMPANY_INFO.indiaOffice.phone}`} className="hover:text-white transition-colors">{settings?.phone || COMPANY_INFO.indiaOffice.phone}</a>
              </li>
              <li className="flex items-center space-x-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0 fill-current" />
                <a 
                  href={`https://wa.me/${(settings?.whatsapp || COMPANY_INFO.indiaOffice.whatsapp).replace(/[^0-9]/g, '')}?text=${waMessage}`}
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  WhatsApp Consultation
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <a href={`mailto:${settings?.email || COMPANY_INFO.indiaOffice.email}`} className="hover:text-white transition-colors break-all">{settings?.email || COMPANY_INFO.indiaOffice.email}</a>
              </li>
            </ul>
          </div>

          {/* PIONEER HEAD OFFICE - CHINA (Col span: 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-500 font-mono">
              {settings?.aboutChinaTitle ? "Reefilm China HQ" : COMPANY_INFO.chinaOffice.title}
            </h3>
            <p className="text-[10px] text-gray-500 leading-snug">
              Manufacturing & Global Operations Headquarters
            </p>
            <ul className="space-y-2.5 text-xs font-mono">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-sans text-gray-400 text-[11px]">{settings?.factoryAddress || COMPANY_INFO.chinaOffice.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`tel:${COMPANY_INFO.chinaOffice.phone}`} className="hover:text-white transition-colors">{COMPANY_INFO.chinaOffice.phone}</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.chinaOffice.email}`} className="hover:text-white transition-colors break-all">{COMPANY_INFO.chinaOffice.email}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* WORLD MAP LOGISTICS & DISTRIBUTION ROUTE GRAPHIC */}
        <div className="border border-white/5 bg-neutral-950/60 p-6 rounded-2xl my-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(227,6,19,0.02),transparent_70%)] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-widest block">GLOBAL DISTRIBUTION LINK</span>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">World-Class Supply Command</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Our supply chains operate natively between our advanced optoelectronics manufacturing hub in Dongguan and local customized on-site lamination, CAD drafting, and technical support offices in Chennai, India.
              </p>
              <div className="flex items-center space-x-4 pt-2 text-[10px] font-mono text-gray-500">
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span>Dongguan Desk</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Chennai Hub</span>
                </div>
              </div>
            </div>

            {/* SVG World Map Illustration */}
            <div className="lg:col-span-8 flex justify-center">
              <div className="w-full max-w-[550px] aspect-[21/9] bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 800 350" className="w-full h-full opacity-70">
                  {/* Subtle dots representing world cities */}
                  <g fill="rgba(255, 255, 255, 0.08)">
                    {/* Simplified world map outline dots */}
                    <circle cx="100" cy="120" r="2" />
                    <circle cx="150" cy="100" r="3" />
                    <circle cx="180" cy="150" r="2" />
                    <circle cx="220" cy="180" r="2.5" />
                    <circle cx="250" cy="220" r="2" />
                    <circle cx="350" cy="80" r="3" />
                    <circle cx="420" cy="120" r="2" />
                    <circle cx="440" cy="140" r="2" />
                    <circle cx="480" cy="150" r="2" />
                    {/* India Region Dots */}
                    <circle cx="560" cy="210" r="4" fill="#10B981" className="animate-ping" style={{ animationDuration: '3s' }} />
                    <circle cx="560" cy="210" r="5" fill="#10B981" />
                    {/* China Region Dots */}
                    <circle cx="620" cy="170" r="4" fill="#EF4444" className="animate-ping" style={{ animationDuration: '2s' }} />
                    <circle cx="620" cy="170" r="5" fill="#EF4444" />
                    
                    {/* Surrounding global dots */}
                    <circle cx="680" cy="240" r="2.5" />
                    <circle cx="710" cy="190" r="2" />
                    <circle cx="750" cy="140" r="3" />
                    <circle cx="720" cy="280" r="2" />
                  </g>

                  {/* Connecting Arc Path */}
                  <path 
                    d="M 620 170 Q 590 140 560 210" 
                    fill="none" 
                    stroke="#EF4444" 
                    strokeWidth="2.5" 
                    strokeDasharray="6,4"
                    className="animate-pulse"
                  />
                  
                  {/* Glowing logistics arc */}
                  <path 
                    d="M 620 170 Q 590 140 560 210" 
                    fill="none" 
                    stroke="url(#arcGradient)" 
                    strokeWidth="3.5" 
                  />

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="arcGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Typography overlays inside SVG */}
                  <text x="635" y="174" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">DONGGUAN DESIGN CENTER</text>
                  <text x="440" y="225" fill="#10B981" fontSize="10" fontFamily="monospace" fontWeight="bold">CHENNAI CENTRAL HUB</text>
                  <text x="50" y="325" fill="rgba(255,255,255,0.2)" fontSize="10" fontFamily="monospace">MAP REF: REEFILM INDIA SUPPLY CHAIN v4.0</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST BUSINESS MESSAGE BANNER */}
        <div className="border-t border-white/10 bg-neutral-950 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-3.5 my-8">
          <Award className="w-6 h-6 text-red-500 shrink-0 mt-0.5 md:mt-0" />
          <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
            <strong className="text-white">COOPERATION TRADEMARK STATEMENT:</strong> Reefilm products are precision manufactured and tested at <strong>Reefilm R&D Center</strong>. Local site structural calibration, custom finishes, CAD layouts, and our <strong>1-Year Warranty</strong> are serviced directly by Raj Gupta's team at <strong>Reefilm India – Chennai</strong>.
          </p>
        </div>

        {/* Separator & Footer Bottom */}
        <div className="border-t border-white/5 pt-6 mt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div className="space-y-1 mb-4 md:mb-0 text-center md:text-left">
            <p>{settings?.footerText || `© ${currentYear} Reefilm India. All Rights Reserved.`}</p>
            <p className="text-[9px] text-gray-600">
              Disclaimer: Reefilm India is the exclusive authorized technical partnership, logistics and sales execution entity in India. All manufacturing outputs belong to Reefilm International.
            </p>
          </div>
          <div className="flex space-x-6">
            <button onClick={() => handleNavClick("contact")} className="hover:text-gray-300 transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => handleNavClick("contact")} className="hover:text-gray-300 transition-colors cursor-pointer">Terms of Service</button>
            <button onClick={() => handleNavClick("admin")} className="text-[10px] text-gray-600 hover:text-gray-400 font-mono transition-colors cursor-pointer">Owner Login</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
