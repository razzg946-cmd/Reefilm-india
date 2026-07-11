import { useState } from "react";
import { ArrowRight, ShieldCheck, Zap, Sliders, Eye, Sun, Play, Layers } from "lucide-react";
import { motion } from "motion/react";
import { WebsiteSettings } from "../types";

interface HeroProps {
  setCurrentTab: (tab: string) => void;
  settings: WebsiteSettings;
}

export default function Hero({ setCurrentTab, settings }: HeroProps) {
  const [activeVisual, setActiveVisual] = useState<"cyber" | "retail" | "abstract">("cyber");
  const [transparency, setTransparency] = useState<number>(90);
  const [brightness, setBrightness] = useState<number>(85);

  const stats = [
    {
      value: "2.0 mm",
      title: "ULTRA-THIN DESIGN",
      desc: "Ultra-thin 2.0 mm flexible transparent LED film designed for seamless installation on existing glass surfaces without requiring a steel structure.",
      icon: Layers,
    },
    {
      value: "90–94%",
      title: "HIGH TRANSPARENCY",
      desc: "Maintains up to 90–94% glass transparency while delivering vibrant digital advertising without blocking natural daylight.",
      icon: Eye,
    },
    {
      value: "Up to 4,000 cd/㎡",
      title: "HIGH BRIGHTNESS",
      desc: "Delivers bright, vivid, and high-contrast visuals for retail stores, shopping malls, corporate offices, airports, hotels, restaurants, and commercial buildings.",
      icon: Sun,
    },
    {
      value: "100,000 H",
      title: "LONG LIFESPAN",
      desc: "Industrial-grade LED technology engineered for reliable performance with an operational lifespan of up to 100,000 hours.",
      icon: ShieldCheck,
    },
  ];

  const getVisualOverlay = () => {
    switch (activeVisual) {
      case "cyber":
        return (
          <div className="absolute inset-0 flex flex-col justify-between p-6 z-20 pointer-events-none transition-all duration-500">
            {/* Top grid and coordinates */}
            <div className="flex justify-between text-[10px] font-mono text-[#FF5F6D] font-bold tracking-widest uppercase">
              <span>SYS_INIT: ONLINE</span>
              <span>GRID_REF: RF-882</span>
            </div>
            {/* Central futuristic grid graphic */}
            <div className="my-auto flex flex-col items-center justify-center space-y-2">
              <div 
                className="w-24 h-24 rounded-full border border-red-500/50 flex items-center justify-center animate-spin"
                style={{ animationDuration: "12s" }}
              >
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FF5F6D]/40 flex items-center justify-center animate-reverse animate-spin" style={{ animationDuration: "8s" }}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-[#FF5F6D] blur-[4px]" />
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF5F6D] uppercase block animate-pulse">
                  CYBERNETIC_STORM_RUNNING
                </span>
                <span className="text-sm font-black text-white uppercase tracking-tight">DYNAMIC MEDIA INTERACTION</span>
              </div>
            </div>
            {/* Bottom status */}
            <div className="flex justify-between text-[9px] font-mono text-gray-400">
              <span>RESOLUTION: P3.9</span>
              <span>REFRESH: 3840Hz</span>
            </div>
          </div>
        );
      case "retail":
        return (
          <div className="absolute inset-0 flex flex-col justify-between p-6 z-20 pointer-events-none transition-all duration-500">
            <div className="flex justify-between text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase">
              <span>BOUTIQUE MODE</span>
              <span>BR-946</span>
            </div>
            <div className="my-auto text-center space-y-3">
              <div className="inline-block px-2 py-0.5 border border-amber-400/30 text-amber-400 text-[9px] tracking-widest font-mono uppercase rounded bg-amber-400/5">
                SUMMER COLLECTION
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white uppercase">
                REEFILM <span className="text-amber-400">LUXURY</span>
              </h3>
              <p className="text-[9px] font-mono text-gray-300 max-w-[200px] mx-auto uppercase tracking-wide">
                Experience high-transparency holographic branding on active retail storefront glass.
              </p>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-gray-400">
              <span>COLOR PRESET: WARM GOLD</span>
              <span>GLOW EFFECT: MAX</span>
            </div>
          </div>
        );
      case "abstract":
        return (
          <div className="absolute inset-0 flex flex-col justify-between p-6 z-20 pointer-events-none transition-all duration-500">
            <div className="flex justify-between text-[10px] font-mono text-emerald-400 font-bold tracking-widest uppercase">
              <span>ECO_AMBIENT</span>
              <span>WAVE-312</span>
            </div>
            <div className="my-auto flex flex-col items-center justify-center space-y-2">
              <div className="flex space-x-1.5 items-end justify-center h-12">
                <div className="w-1.5 h-8 bg-emerald-500/80 rounded animate-pulse" />
                <div className="w-1.5 h-12 bg-emerald-400 rounded animate-pulse delay-75" />
                <div className="w-1.5 h-6 bg-teal-500 rounded animate-pulse delay-150" />
                <div className="w-1.5 h-10 bg-emerald-500 rounded animate-pulse delay-200" />
                <div className="w-1.5 h-4 bg-emerald-600 rounded animate-pulse delay-300" />
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">BIOPHILIC_RHYTHM_V1</span>
                <span className="text-sm font-black text-white uppercase tracking-tight block">ORGANIC KINETIC WAVE</span>
              </div>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-gray-400">
              <span>ACTIVE LAYER: BIO-NODE</span>
              <span>AUDIO LINK: OFF</span>
            </div>
          </div>
        );
    }
  };

  return (
    <section id="hero-section" className="relative bg-black text-white overflow-hidden min-h-[90vh] flex flex-col justify-center py-20">
      {/* Background Neon Glow Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[15%] w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] bg-red-800/15 rounded-full blur-[140px] animate-pulse duration-[8000ms]" />
        {/* Animated matrix grid overlay to look like clean architectural lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Headline and Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status pill */}
            <div className="inline-block px-3.5 py-1 bg-[#E30613]/15 border border-[#E30613]/50 rounded text-[10px] font-bold uppercase tracking-wider text-[#FF5F6D] mb-2">
              {settings.homeHeroBanner || "Official Indian Partner of REEFILM China"}
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-display text-white">
              {settings.homeHeroHeadline || "Transform Glass Into Brilliant Active LED Displays."}
            </h1>

            {/* PERSUASIVE COPY */}
            <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
              {settings.homeHeroSubtitle || "We specialize in premium transparent LED film and customized digital display installations. Reefilm India is the country's dedicated partner, delivering advanced, paper-thin, transparent screens that retain beautiful glass visibility while offering stellar brightness, vibrant colours, and certified safety."}
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="hero-quote-btn"
                onClick={() => setCurrentTab(settings.homeHeroCta1Tab || "quote")}
                className="w-full sm:w-auto bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all shadow-[0_5px_25px_rgba(227,6,19,0.3)] hover:shadow-[0_5px_30px_rgba(227,6,19,0.5)] flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{settings.homeHeroCta1Text || "Explore Products"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="hero-demo-btn"
                onClick={() => setCurrentTab(settings.homeHeroCta2Tab || "projects")}
                className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition-all flex items-center justify-center space-x-2 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{settings.homeHeroCta2Text || "Our Projects"}</span>
              </button>
            </div>

            {/* Certifications and trust badges */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Certified LED Solutions Integrator</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>BIS, CE & FCC Certified Quality</span>
              </div>
            </div>
          </div>

          {/* Graphical/Creative Transparent LED Simulator */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            {/* Elegant glass frame visualization */}
            <div className="relative w-full max-w-[380px] h-[480px] bg-neutral-900/30 border border-white/15 rounded-3xl backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between">
              
              {/* Actual physical background image (The retail boutique behind glass) */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                <img 
                  src={settings.homeHeroImage || "/src/assets/images/transparent_led_display_1782711533489.jpg"} 
                  alt="Transparent LED Retail Storefront"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: (100 - transparency) / 100 + 0.15 }}
                />
                {/* Black overlay representing glass pane tint */}
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Reflective shine across glass card */}
              <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-b from-white/10 via-white/0 to-white/0 transform -skew-y-12 translate-y-[-50%] pointer-events-none z-10" />

              {/* Glass Header */}
              <div className="relative z-30 flex items-center justify-between border-b border-white/10 p-5 bg-black/40 backdrop-blur-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                  <span className="text-[9px] font-mono tracking-widest text-gray-300 font-bold uppercase">TRANSPARENT LED PREVIEW</span>
                </div>
                <div className="text-[9px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold uppercase">
                  Active Display
                </div>
              </div>

              {/* Glowing Hologram Active Overlay Layer */}
              <div 
                className="relative flex-grow overflow-hidden transition-all duration-300"
                style={{ 
                  opacity: brightness / 100,
                  filter: `drop-shadow(0 0 ${8 * (brightness / 100)}px rgba(239, 68, 68, 0.45))`
                }}
              >
                {getVisualOverlay()}
              </div>

              {/* Controls inside the Glass Frame */}
              <div className="relative z-30 border-t border-white/10 p-4 bg-black/70 backdrop-blur-xs space-y-3">
                {/* Visual content switcher */}
                <div className="flex items-center justify-between gap-1 bg-white/5 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveVisual("cyber")}
                    className={`flex-1 text-[9px] font-mono uppercase font-bold py-1.5 px-2 rounded-md transition-colors ${activeVisual === "cyber" ? "bg-red-600 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                  >
                    Cyber Grid
                  </button>
                  <button 
                    onClick={() => setActiveVisual("retail")}
                    className={`flex-1 text-[9px] font-mono uppercase font-bold py-1.5 px-2 rounded-md transition-colors ${activeVisual === "retail" ? "bg-red-600 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                  >
                    Boutique
                  </button>
                  <button 
                    onClick={() => setActiveVisual("abstract")}
                    className={`flex-1 text-[9px] font-mono uppercase font-bold py-1.5 px-2 rounded-md transition-colors ${activeVisual === "abstract" ? "bg-red-600 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                  >
                    Kinetic
                  </button>
                </div>

                {/* Control sliders */}
                <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-gray-400">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-red-400" /> Transparency</span>
                      <span className="text-white font-bold">{transparency}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="90" 
                      value={transparency} 
                      onChange={(e) => setTransparency(Number(e.target.value))}
                      className="w-full accent-red-600 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="flex items-center gap-1"><Sun className="w-3 h-3 text-amber-400" /> Glow Brightness</span>
                      <span className="text-white font-bold">{brightness}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="100" 
                      value={brightness} 
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-red-600 h-1 bg-neutral-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative controller box annotation under the simulator */}
            <div className="mt-3 flex items-center space-x-1.5 text-[9px] font-mono text-gray-500 bg-neutral-900/30 border border-white/5 py-1 px-3 rounded-full">
              <Sliders className="w-3 h-3 text-red-500" />
              <span>Interactive Glass Screen Simulation Control</span>
            </div>

            {/* Glowing accent backdrops */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-red-600 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full blur-3xl opacity-10 pointer-events-none" />
          </div>

        </div>

        {/* Statistics panel */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:bg-white/[0.04] hover:border-[#E30613]/30 hover:shadow-[0_10px_30px_rgba(227,6,19,0.08)] transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Subtle top light bar or flare on hover */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#E30613]/0 to-transparent group-hover:via-[#E30613]/50 transition-all duration-500 rounded-t-2xl" />

              <div className="space-y-4">
                {/* Icon row */}
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 group-hover:bg-[#E30613]/10 group-hover:border-[#E30613]/20 transition-colors duration-300">
                    <stat.icon className="w-5 h-5 text-gray-400 group-hover:text-[#FF5F6D] transition-colors duration-300" />
                  </div>
                  {/* Decorative faint card number */}
                  <div className="w-6 h-6 rounded-md border border-white/[0.03] flex items-center justify-center text-[8px] font-mono text-gray-700 select-none">
                    0{idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                  >
                    <p className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                      {stat.value}
                    </p>
                  </motion.div>
                  
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FF5F6D]">
                    {stat.title}
                  </p>
                  
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed font-light font-sans">
                    {stat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

