import { Mail, Phone, MapPin, MessageSquare, ShieldCheck, ArrowRight, Linkedin, Twitter, Facebook } from "lucide-react";
import { COMPANY_INFO } from "../data";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer-section" className="bg-black border-t border-white/10 text-gray-400 font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick("home")}>
              <div className="w-8 h-8 bg-gradient-to-tr from-red-600 to-black rounded flex items-center justify-center border border-red-500/20 shadow-[0_0_10px_rgba(227,6,19,0.2)]">
                <span className="text-white font-black text-base">R</span>
              </div>
              <span className="text-white font-black text-base tracking-wider">REEFILM <span className="text-red-600">INDIA</span></span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              Authorized Sales, Installation & Technical Support Partner in India. Providing pioneering adhesive and flexible transparent LED display solutions for premier corporate glass facades and luxury retail storefronts.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-gray-500 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-md w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>Certified Technical Partner — India</span>
            </div>
            <div className="flex space-x-3 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white hover:bg-white/5 p-2 rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-mono">Our Portfolio</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNavClick("products")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Transparent LED Film
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("products")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Flexible LED Film
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("products")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Structural Glass Display
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("applications")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Luxury Storefronts
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("applications")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Corporate Facades
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-mono">Resources & Info</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNavClick("about")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Company Story
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("resources")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Download Catalogs
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("blog")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Technology Insights
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("resources")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  Product Datasheets
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("contact")} className="hover:text-white hover:translate-x-1 transition-all flex items-center">
                  <ArrowRight className="w-3 h-3 text-red-500 mr-1.5 shrink-0" />
                  On-Site Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4 font-mono">Indian Head Office</h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-gray-400">{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white transition-colors">{COMPANY_INFO.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors">{COMPANY_INFO.email}</a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href={`https://wa.me/${COMPANY_INFO.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Direct WhatsApp Support</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <div className="space-y-1 mb-4 md:mb-0 text-center md:text-left">
            <p>© {currentYear} Reefilm India. All Rights Reserved.</p>
            <p className="text-[10px] text-gray-600">
              Disclaimer: Reefilm India operates as an independent authorized sales, execution, and support partner in India. All registered trademarks are property of their respective owners.
            </p>
          </div>
          <div className="flex space-x-6">
            <button onClick={() => handleNavClick("contact")} className="hover:text-gray-300 transition-colors">Privacy Policy</button>
            <button onClick={() => handleNavClick("contact")} className="hover:text-gray-300 transition-colors">Terms of Service</button>
            <button onClick={() => handleNavClick("admin")} className="hover:text-gray-300 font-mono transition-colors">Operator Log</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
