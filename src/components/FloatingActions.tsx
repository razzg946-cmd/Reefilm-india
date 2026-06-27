import { useState, useEffect } from "react";
import { MessageSquare, Phone, ArrowUp } from "lucide-react";
import { COMPANY_INFO } from "../data";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="floating-actions-bar" className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
      
      {/* WhatsApp Action button */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsapp.replace('+', '')}`}
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all group"
        title="Direct WhatsApp Consultation"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="absolute right-14 bg-black/80 text-white text-[10px] uppercase font-mono px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          WhatsApp Consulting
        </span>
      </a>

      {/* Direct Call Button */}
      <a
        href={`tel:${COMPANY_INFO.phone}`}
        className="w-12 h-12 bg-[#E30613] hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(227,6,19,0.4)] hover:scale-105 active:scale-95 transition-all group"
        title="Direct Consultation Hotline"
      >
        <Phone className="w-5 h-5 fill-current" />
        <span className="absolute right-14 bg-black/80 text-white text-[10px] uppercase font-mono px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Call Project Desk
        </span>
      </a>

      {/* Back to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-neutral-900 border border-white/10 hover:border-white/20 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          title="Scroll Back To Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
