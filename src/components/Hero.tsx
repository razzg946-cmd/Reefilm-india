import { ArrowRight, Sparkles, Play, Shield, ShieldCheck, Zap } from "lucide-react";

interface HeroProps {
  setCurrentTab: (tab: string) => void;
}

export default function Hero({ setCurrentTab }: HeroProps) {
  const stats = [
    { value: "85%", label: "Max Transparency", desc: "Virtually invisible from outside when inactive" },
    { value: "5500+", label: "Max Nit Brightness", desc: "Daylight readable, even under direct Indian sun" },
    { value: "3.9mm", label: "Ultra Fine Pitch", desc: "Crisp high-definition text and 3D holograms" },
    { value: "3+", label: "Years On-Site Warranty", desc: "Full local technical support & replacements" },
  ];

  return (
    <section id="hero-section" className="relative bg-black text-white overflow-hidden min-h-[90vh] flex flex-col justify-center py-20">
      {/* Background Neon Glow Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[15%] w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-red-800/15 rounded-full blur-[140px] animate-pulse duration-[8000ms]" />
        {/* Animated matrix grid overlay to look like LED glass */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Headline and Copy */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Status pill */}
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-medium text-red-500 font-mono shadow-[0_4px_12px_rgba(227,6,19,0.1)] mx-auto lg:mx-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin duration-1000" />
              <span>Premium Architectural LED Film Solutions</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              Transform Glass Into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-white">
                Brilliant Digital Experiences
              </span>
            </h1>

            {/* PERSUASIVE COPY */}
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Reefilm India is the country's elite authorized partner for cutting-edge <span className="text-white font-semibold">Transparent LED Displays</span>. We laminate ultra-thin, adhesive digital film directly onto your existing showroom windows and corporate glass facades—retaining <span className="text-white font-semibold">up to 85% natural daylight</span> while rendering stunning, sunlight-readable holographic content.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-quote-btn"
                onClick={() => setCurrentTab("quote")}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_5px_25px_rgba(227,6,19,0.4)] hover:shadow-[0_5px_30px_rgba(227,6,19,0.6)] flex items-center justify-center space-x-2.5 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                id="hero-demo-btn"
                onClick={() => setCurrentTab("contact")}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2.5"
              >
                <Play className="w-4 h-4 text-red-500 fill-current" />
                <span>Book Live Experience</span>
              </button>
            </div>

            {/* Certifications and trust badges */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Certified Installer Partner</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>ROHS & CE Quality Approved</span>
              </div>
            </div>
          </div>

          {/* Graphical/Creative Glass LED Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Elegant glass frame visualization */}
            <div className="relative w-full max-w-[380px] h-[480px] bg-white/5 border border-white/15 rounded-3xl p-6 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
              
              {/* Reflective shine across glass card */}
              <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-b from-white/10 via-white/0 to-white/0 transform -skew-y-12 translate-y-[-50%] pointer-events-none" />

              {/* Glass Header */}
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 font-bold uppercase">GLASS DISPLAY PREVIEW</span>
                </div>
                <div className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
                  85% SEE-THROUGH
                </div>
              </div>

              {/* Glowing Hologram Core */}
              <div className="relative my-auto flex flex-col items-center justify-center py-6">
                {/* Simulated spinning hologram globe/watch */}
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-red-600/40 flex items-center justify-center animate-spin duration-10000 relative">
                  <div className="absolute inset-2 rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-red-600 to-red-400 rounded-full blur-md opacity-70 animate-pulse" />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <span className="text-xs font-mono text-red-500 uppercase font-bold tracking-widest block mb-1">Active Pixel Layer</span>
                  <p className="text-xl font-black tracking-tight">STUNNING 3D VISUALS</p>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-[220px] mx-auto">Natural light filters seamlessly from the rear of the glass panel.</p>
                </div>
              </div>

              {/* Glass Footer */}
              <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span>Thickness: 1.2mm</span>
                <span>Self-Adhesive Layer</span>
              </div>
            </div>

            {/* Glowing accent backdrops */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-red-600 rounded-full blur-3xl opacity-40" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full blur-3xl opacity-10" />
          </div>

        </div>

        {/* Statistics panel */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1.5 text-center sm:text-left border-r last:border-r-0 border-white/5 pr-4 last:pr-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-red-500">{stat.label}</p>
              <p className="text-[10px] text-gray-500 leading-snug">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
