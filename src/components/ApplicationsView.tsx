import { useState } from "react";
import { APPLICATIONS } from "../data";
import { ApplicationItem } from "../types";
import { LayoutGrid, CheckSquare, Target, Trophy, ArrowRight } from "lucide-react";

interface ApplicationsViewProps {
  setCurrentTab: (tab: string) => void;
}

export default function ApplicationsView({ setCurrentTab }: ApplicationsViewProps) {
  const [activeApp, setActiveApp] = useState<ApplicationItem>(APPLICATIONS[0]);

  return (
    <div id="applications-page" className="bg-black text-white font-sans min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">TAILORED INDUSTRY INTEGRATION</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Architectural Applications</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Explore how premium commercial sectors utilize self-adhesive transparent LED films, flexible curve wraps, and high-brightness active media to create stunning digital glass facades.
          </p>

          {/* Quick tab nav */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {APPLICATIONS.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeApp.id === app.id
                    ? "bg-white text-black border-white shadow-[0_4px_15px_rgba(255,255,255,0.15)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {app.title.split(" & ")[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Focus Panel */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Beautiful Application Info */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">SEGMENT DEEP DIVE</span>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">{activeApp.title}</h2>
                <p className="text-sm text-gray-400 italic mt-2">{activeApp.tagline}</p>
              </div>

              <div className="prose prose-invert">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{activeApp.overview}</p>
              </div>

              {/* Recommended Products */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">RECOMMENDED TECHNOLOGY</h3>
                <div className="flex flex-wrap gap-2">
                  {activeApp.recommendedProducts.map((prod, idx) => (
                    <span key={idx} className="bg-red-600/10 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold font-mono text-red-400">
                      {prod}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Benefits checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">SECTOR SPECIFIC ADVANTAGES</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeApp.benefits.map((ben, idx) => (
                    <div key={idx} className="border border-white/5 bg-white/[0.01] p-4 rounded-xl flex items-start space-x-2.5">
                      <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-300 leading-snug">{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Immersive Case Study */}
            <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl" />
              
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold block mb-1">INDIA CASE STUDY PREVIEW</span>
                <h3 className="text-base font-bold text-white">{activeApp.caseStudy.title}</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-red-500 uppercase font-mono font-bold">
                    <Target className="w-3.5 h-3.5" />
                    <span>The Challenge</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{activeApp.caseStudy.challenge}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-emerald-500 uppercase font-mono font-bold">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>The Solution</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{activeApp.caseStudy.solution}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-xs text-amber-500 uppercase font-mono font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Proven Outcome</span>
                  </div>
                  <p className="text-xs text-gray-300 font-semibold leading-relaxed">{activeApp.caseStudy.result}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <button
                  onClick={() => setCurrentTab("quote")}
                  className="w-full bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Request ROI Breakdown</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-gray-500 font-mono">No commitments required • Free structural CAD layout</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
