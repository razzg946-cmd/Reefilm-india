import { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("reefilm_cookie_accepted");
    if (!accepted) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("reefilm_cookie_accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div id="cookie-overlay-banner" className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-start space-x-3.5">
        <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-red-500" />
        </div>
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy & Calibration Integrity</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
              We use standard local storage configurations to preserve your architectural CAD preferences and analytical estimations. No personal parameters are dispatched without confirmation.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAccept}
              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded"
            >
              Accept Compliance
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-500 hover:text-white p-1 text-[10px]"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
