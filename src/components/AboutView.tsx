import { Target, Eye, Users, Award, ShieldCheck, Zap, ArrowRight, BookOpen } from "lucide-react";
import { COMPANY_INFO } from "../data";

interface AboutViewProps {
  setCurrentTab: (tab: string) => void;
}

export default function AboutView({ setCurrentTab }: AboutViewProps) {
  const steps = [
    { num: "01", title: "Technical Consultation", desc: "We study your architectural drawings, ambient sunlight angles, and calculate optimal viewing distances." },
    { num: "02", title: "CAD & Structural Simulation", desc: "Our team drafts detailed layouts showing precise pixel layout, power injection points, and cabling routes." },
    { num: "03", title: "Precision Optical Lamination", desc: "Certified Reefilm technicians wet-laminate the adhesive display onto existing glass, completely bubble-free." },
    { num: "04", title: "Pixel Calibration & Programming", desc: "We program the media player and calibrate brightness nits, color fidelity, and refresh rates." },
    { num: "05", title: "On-Site Warranty & Support", desc: "3-Year local on-site support with physical parts dispatch within 24 hours across key Indian cities." },
  ];

  const coreValues = [
    { icon: <ShieldCheck className="w-6 h-6 text-red-500" />, title: "Authorized Guarantee", desc: "We supply 100% certified international grade transparent display film, backed by authorized safety certificates." },
    { icon: <Zap className="w-6 h-6 text-red-500" />, title: "Precision Engineering", desc: "From wind-permeability ratios to structural thermal loads, our Indian engineer desk leaves zero room for error." },
    { icon: <Users className="w-6 h-6 text-red-500" />, title: "Local Presence", desc: "Founded by Raj Gupta, our headquarters are in Gurugram, with technical support nodes located in Mumbai and Bengaluru." },
  ];

  return (
    <div id="about-page" className="bg-black text-white font-sans">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">ABOUT REEFILM INDIA</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">India's Premier Transparent <br />LED Solutions Partner</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Connecting architectural integrity with high-technology digital art. Spearheaded by Raj Gupta, we specialize in supplying, installing, and servicing state-of-the-art see-through displays.
          </p>
        </div>
      </section>

      {/* Founder & Core Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 relative p-8 flex flex-col justify-between shadow-2xl">
                {/* Visual Glass effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-white/5" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center mb-6">
                    <Award className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white">Raj Gupta</h3>
                  <p className="text-xs text-red-500 font-mono mt-1 uppercase tracking-wider font-semibold">Founder & Managing Director</p>
                </div>

                <div className="relative z-10 bg-black/60 backdrop-blur-md border border-white/5 p-4 rounded-xl">
                  <p className="text-xs italic text-gray-300">
                    \"Our mission is simple: to liberate corporate facades and retail showrooms from heavy black metal boxes, converting architectural glass into dynamic, breathable artistic media portals.\""
                  </p>
                </div>
              </div>
            </div>

            {/* Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">OUR ORIGIN & VALUES</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Pioneering See-Through Visuals Across India</h2>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Founded in 2021 by industrial veteran Raj Gupta, Reefilm India was established to bridge a massive gap in the Indian architectural display market. Traditional LED displays block natural views, are excessively heavy, and trigger severe structural and local municipal safety compliance issues.
              </p>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                As an independent, authorized sales, lamination, and engineering support partner, we supply premium-tier materials directly from specialized global manufacturers. We custom fabricate surrounding aluminum channels, engineer structural cabling pathways, and provide localized calibration and 24/7 technical hotline access.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="border border-white/5 bg-white/[0.01] p-5 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Our Mission</span>
                  </div>
                  <p className="text-xs text-gray-400">To equip premium commercial projects in India with ultra-efficient, highly aesthetic, sunlight-readable digital glass displays that save energy and build branding equity.</p>
                </div>
                
                <div className="border border-white/5 bg-white/[0.01] p-5 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <Eye className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Our Vision</span>
                  </div>
                  <p className="text-xs text-gray-400">To set the gold standard in Indian visual retail and corporate glass facade developments, turning every major high-street showroom into a spectacular architectural landmark.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-neutral-950 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">THE REEFILM STANDARD</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">Why Corporate India Chooses Reefilm</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((val, idx) => (
              <div key={idx} className="border border-white/10 bg-black p-8 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                <div className="mb-4">{val.icon}</div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider mb-2">{val.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Execution Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">OUR ENGINEERING TIMELINE</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">From Blueprint to Digital Masterpiece</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="border border-white/5 bg-white/[0.01] p-6 rounded-xl relative flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-black text-red-600/30 font-mono block mb-4">{step.num}</span>
                  <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{step.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => setCurrentTab("quote")}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>Consult with Raj Gupta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
