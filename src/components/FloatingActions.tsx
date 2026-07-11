import { useState, useEffect } from "react";
import { MessageSquare, Phone, Mail, ArrowUp } from "lucide-react";
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

  // Pre-filled WhatsApp template requested by the user
  const whatsappNumber = "918577917327";
  const whatsappMessage = encodeURIComponent(
    "Hello Reefilm India,\n\nI am interested in premium Transparent LED Film Display Solutions.\n\nPlease send me more information."
  );

  return (
    <div id="floating-actions-bar" className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50 font-sans">
      
      {/* 1. WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(16,185,129,0.45)] hover:scale-105 active:scale-95 transition-all group relative"
        title="WhatsApp Consultation"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="absolute right-14 bg-black/90 text-white text-[10px] uppercase font-bold font-mono px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          WhatsApp Desk
        </span>
      </a>

      {/* 2. Direct Call Button */}
      <a
        href="tel:+918577917327"
        className="w-12 h-12 bg-[#E30613] hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(227,6,19,0.45)] hover:scale-105 active:scale-95 transition-all group relative"
        title="Consultation Hotline"
      >
        <Phone className="w-5 h-5 fill-current" />
        <span className="absolute right-14 bg-black/90 text-white text-[10px] uppercase font-bold font-mono px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Call Raj Gupta
        </span>
      </a>

      {/* 3. Direct Email Button */}
      <a
        href="mailto:razzg946@gmail.com"
        className="w-12 h-12 bg-neutral-900 border border-white/15 hover:border-white/25 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group relative"
        title="Send Email"
      >
        <Mail className="w-5 h-5" />
        <span className="absolute right-14 bg-black/90 text-white text-[10px] uppercase font-bold font-mono px-2.5 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Email Chennai Desk
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
