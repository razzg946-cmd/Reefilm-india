import { 
  Target, Eye, Users, Award, ShieldCheck, Zap, ArrowRight, 
  MapPin, Phone, Mail, Building2, Cpu, Globe, LifeBuoy, 
  CheckCircle2, Compass, Briefcase, Server 
} from "lucide-react";
import { COMPANY_INFO } from "../data";

import { TeamMember, WebsiteSettings } from "../types";

interface AboutViewProps {
  setCurrentTab: (tab: string) => void;
  teamMembers: TeamMember[];
  settings: WebsiteSettings;
}

export default function AboutView({ setCurrentTab, teamMembers, settings }: AboutViewProps) {
  return (
    <div id="about-page" className="bg-black text-white font-sans selection:bg-red-500 selection:text-white">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-950 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-950/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">
            {settings.aboutHeaderSubtitle || "ABOUT US"}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            {settings.aboutHeaderTitle || "Corporate Profile & Team"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {settings.aboutHeaderIntro || "Reefilm India is an independent Indian enterprise leading the country's architectural digital transformation with premium transparent LED lamination, advanced project engineering, and nationwide technical support."}
          </p>
        </div>
      </section>

      {/* SECTION 1: ABOUT REEFILM INDIA */}
      <section className="py-20 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left side: Company Description */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
                {settings.aboutChinaSub || "01 / Independent Indian Pioneer"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                {settings.aboutChinaTitle || "Architectural Transparent LED Display Solutions"}
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                <p>
                  {settings.aboutChinaText || "Reefilm India specializes in state-of-the-art Transparent LED Film Display technology for commercial, retail, architectural, hospitality, and smart glass applications across India. We deliver seamless lamination onto glass, providing high-brightness daylight advertising while retaining interior natural daylight."}
                </p>
              </div>
            </div>
            
            {/* Right side: Key Metadata Deck */}
            <div className="lg:col-span-5">
              <div className="border border-white/10 bg-neutral-950 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-bl-full pointer-events-none" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-6 border-b border-white/5 pb-3">Company Information</h3>
                
                <div className="space-y-4 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                    <span className="text-gray-500 uppercase">FOUNDER:</span>
                    <span className="text-white font-sans font-semibold">{settings.aboutChinaFounder || "Raj Gupta"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                    <span className="text-gray-500 uppercase">OFFICIAL WEBSITE:</span>
                    <a href={`https://${settings.aboutChinaWebsite || "www.reefilm.in"}`} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 font-sans font-semibold transition-colors">
                      {settings.aboutChinaWebsite || "www.reefilm.in"}
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 border-b border-white/5 pb-3">
                    <span className="text-gray-500 uppercase">HEADQUARTERS:</span>
                    <span className="text-white font-sans font-semibold">{settings.aboutChinaHeadquarters || "Chennai, Tamil Nadu, India"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 pb-1">
                    <span className="text-gray-500 uppercase">BUSINESS:</span>
                    <span className="text-white font-sans font-semibold">{settings.aboutChinaBusiness || "Transparent LED Film Solutions"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LEADERSHIP & GLOBAL TEAM */}
      <section className="py-20 bg-neutral-950 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
              {settings.aboutTeamSub || "02 / Leadership & Global Team"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {settings.aboutTeamTitle || "Executive Management"}
            </h2>
            <p className="text-xs text-gray-400">
              {settings.aboutTeamDesc || "Meet our premium global management team driving innovation, strategic sales, and operational excellence."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="border border-white/5 bg-black/50 p-6 rounded-2xl flex flex-col justify-between relative group hover:border-red-500/20 transition-all duration-300 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-16 h-16 bg-red-600/5 rounded-bl-full pointer-events-none" />
                <div className="space-y-4">
                  {/* Modern circular avatar with initials */}
                  <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 font-mono font-bold text-lg shadow-inner">
                    {member.initials || member.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white uppercase tracking-wider">{member.name}</h4>
                    <p className="text-[10px] text-red-500 font-mono uppercase tracking-widest mt-0.5">{member.position}</p>
                    <p className="text-[9px] text-gray-500 font-mono uppercase mt-0.5">{member.department}</p>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {member.bio}
                    </p>
                    {member.email && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors pt-1">
                        <Mail className="w-3.5 h-3.5" />
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {teamMembers.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 text-xs font-mono">
                No leadership profile listings currently published in dynamic registry.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: ENGINEERING CENTER */}
      <section className="py-20 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side: Manufacturing info */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
                {settings.aboutFactorySub || "03 / Local Engineering Center"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                {settings.aboutFactoryTitle || "Advanced Production & Cleanroom Lamination Systems"}
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                <p>
                  {settings.aboutFactoryDesc1 || "Our local technical integration division is engineered to coordinate pristine, high-transparency glass displays with micrometric accuracy. Operating under certified installation protocols, our lamination engineers produce durable polymer substrates optimized for continuous architectural lamination."}
                </p>
                <p>
                  {settings.aboutFactoryDesc2 || "Every batch of Transparent LED Film undergoes a comprehensive battery of stress tests, including aging cycles and thermal calibration, ensuring long-term optical brilliance and physical stability under Indian weather conditions."}
                </p>
              </div>
            </div>

            {/* Right side: Premium Location Card with Factory Icon */}
            <div className="lg:col-span-5">
              <div className="border border-white/10 bg-neutral-950 p-6 sm:p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-bl-full pointer-events-none" />
                
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Engineering Base</h3>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Chennai HQ</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-gray-300 font-sans leading-relaxed">
                    <span className="text-[10px] text-red-500 font-mono uppercase tracking-wider block mb-1">Corporate Address:</span>
                    <p className="whitespace-pre-line text-white text-xs">{settings.factoryAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: GLOBAL BUSINESS */}
      <section className="py-20 bg-neutral-950 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">
              {settings.aboutServicesSub || "04 / Global Business"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              {settings.aboutServicesTitle || "Core Competencies & Services"}
            </h2>
            <p className="text-xs text-gray-400">
              {settings.aboutServicesDesc || "Expanding dynamic architecture and transparent digital signage interfaces globally."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Transparent LED Film */}
            <div className="border border-white/5 bg-black p-6 rounded-2xl flex flex-col justify-between relative group hover:border-red-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500 w-fit">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Transparent LED Film</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Pioneering flexible, self-adhesive polymer screens designed to turn flat glass windows into dynamic, high-definition digital canvases.
                </p>
              </div>
            </div>

            {/* Card 2: Commercial Digital Display */}
            <div className="border border-white/5 bg-black p-6 rounded-2xl flex flex-col justify-between relative group hover:border-red-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500 w-fit">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Commercial Digital Display</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Delivering high-brightness, high-impact advertisement solutions that command attention in retail, airports, malls, and lobbies.
                </p>
              </div>
            </div>

            {/* Card 3: Architectural Glass Display */}
            <div className="border border-white/5 bg-black p-6 rounded-2xl flex flex-col justify-between relative group hover:border-red-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500 w-fit">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Architectural Glass Display</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Engineered for seamless integration with structural facades, luxury storefronts, and interior partitions without blocking natural light.
                </p>
              </div>
            </div>

            {/* Card 4: Global Engineering Support */}
            <div className="border border-white/5 bg-black p-6 rounded-2xl flex flex-col justify-between relative group hover:border-red-500/20 transition-all duration-300">
              <div className="space-y-4">
                <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500 w-fit">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">Global Engineering Support</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Providing complete technical backup, project consultation, custom calibration guidelines, and certified firmware support globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: REEFILM INDIA */}
      <section className="py-20 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side: Description */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">
                {settings.aboutIndiaSub || "05 / Reefilm India"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                {settings.aboutIndiaTitle || "Authorized Sales, Installation & Technical Support Partner"}
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-gray-400 leading-relaxed">
                <p>
                  {settings.aboutIndiaDesc1 || "Reefilm India is the Authorized Sales, Installation & Technical Support Partner for India."}
                </p>
                <p>
                  {settings.aboutIndiaDesc2 || "We provide product consultation, project design support, installation guidance, technical assistance, and after-sales support across India. This unified framework guarantees that B2B clients, project architects, and system integrators receive elite factory warranty SLAs directly here in India."}
                </p>
              </div>
            </div>

            {/* Right side: Premium Info Frame */}
            <div className="lg:col-span-5">
              <div className="border border-emerald-500/15 bg-neutral-950 p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3 text-emerald-400">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">India SLA Guarantees</span>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-gray-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{settings.aboutIndiaSLA1 || "On-Site Lamination Audits & Site Preparation Services"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{settings.aboutIndiaSLA2 || "Local 1-Year Comprehensive Warranty & Parts Buffering"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{settings.aboutIndiaSLA3 || "Certified Calibration and Software Training (Chennai Desk)"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-16 bg-neutral-950 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
            {settings.aboutCtaTitle || "Need a customized mock-up or architectural proposal?"}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {settings.aboutCtaDesc || "Connect with our authorized engineering support cell in Chennai for free calculations and grid drawings."}
          </p>
          <div>
            <button
              onClick={() => setCurrentTab("quote")}
              className="bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-lg transition-colors inline-flex items-center space-x-2 cursor-pointer shadow-lg shadow-red-600/10"
            >
              <span>Request Quote / Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
