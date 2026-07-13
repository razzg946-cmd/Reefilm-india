import { useState } from "react";
import { INITIAL_PROJECTS } from "../data";
import { Project } from "../types";
import { MapPin, Calendar, CheckSquare, Star, ArrowLeftRight } from "lucide-react";

interface ProjectsViewProps {
  setCurrentTab: (tab: string) => void;
  projects: Project[];
}

export default function ProjectsView({ setCurrentTab, projects }: ProjectsViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [showBefore, setShowBefore] = useState<{ [key: string]: boolean }>({});

  const activeProjects = projects && projects.length > 0 ? projects : INITIAL_PROJECTS;

  const filters = ["All", ...Array.from(new Set(activeProjects.map(p => p.category)))];

  const filteredProjects = selectedFilter === "All"
    ? activeProjects
    : activeProjects.filter(p => p.category === selectedFilter);

  const toggleBeforeAfter = (projectId: string) => {
    setShowBefore(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  return (
    <div id="projects-page" className="bg-black text-white font-sans min-h-screen">
      {/* Page Header */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">PROVEN INDIAN RECORD</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Interactive Portfolio</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Browse our landmark installations across Gurugram, Delhi NCR, Mumbai, and Bengaluru. Toggle between structural views and fully active display states.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedFilter === f
                    ? "bg-red-600 border-red-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {filteredProjects.map((proj) => {
              const isBefore = showBefore[proj.id] || false;
              return (
                <div key={proj.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-white/5 pb-16 last:border-b-0">
                  
                  {/* Left Column: Visual Before/After Showcase */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
                      <img
                        src={isBefore ? proj.beforeImage : proj.afterImage}
                        alt={`${proj.title} Showcase`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* State overlay badge */}
                      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider">
                        {isBefore ? (
                          <span className="text-gray-400">Before: Pure Structural Glass</span>
                        ) : (
                          <span className="text-red-500 animate-pulse">After: 100% Active Display</span>
                        )}
                      </div>

                      {/* Interactive toggle on the bottom */}
                      <button
                        onClick={() => toggleBeforeAfter(proj.id)}
                        className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg active:scale-95 transition-transform"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Toggle View State</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-center text-gray-500 font-mono">
                      *Click \"Toggle View State\" above to see the incredible transformation in real-time.
                    </p>
                  </div>

                  {/* Right Column: Key Details & Clients review */}
                  <div className="lg:col-span-6 space-y-6">
                    <div>
                      <span className="text-xs font-mono text-red-500 uppercase tracking-widest block font-bold">{proj.category}</span>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">{proj.title}</h2>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 border-y border-white/5 py-3">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{proj.location}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span>{proj.timeline}</span>
                      </div>
                      {proj.installationSize && (
                        <div className="flex items-center space-x-1.5">
                          <CheckSquare className="w-4 h-4 text-red-500" />
                          <span>Size: {proj.installationSize}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Highlights & Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {proj.projectHighlights && proj.projectHighlights.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">Project Highlights</h4>
                          <ul className="space-y-1">
                            {proj.projectHighlights.map((hl, idx) => (
                              <li key={idx} className="text-[11px] text-gray-400 flex items-start space-x-1.5">
                                <span className="text-red-500 font-bold">•</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {proj.customerBenefits && proj.customerBenefits.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">Customer Benefits</h4>
                          <ul className="space-y-1">
                            {proj.customerBenefits.map((ben, idx) => (
                              <li key={idx} className="text-[11px] text-gray-400 flex items-start space-x-1.5">
                                <span className="text-emerald-500 font-bold">✓</span>
                                <span>{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Tech list */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">TECHNOLOGY DEPLOYED</h4>
                      <div className="flex flex-wrap gap-2">
                        {proj.techUsed.map((tech, idx) => (
                          <span key={idx} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-xs text-gray-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Client testimonial embedded */}
                    {proj.review && (
                      <div className="bg-white/[0.01] border-l-2 border-red-500 p-5 rounded-r-xl space-y-2">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(proj.review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-xs italic text-gray-400 leading-relaxed">
                          \"{proj.review.text}\"
                        </p>
                        <div className="text-[10px] text-gray-500 font-mono">
                          <span className="font-bold text-white block">{proj.review.reviewer}</span>
                          <span>{proj.review.role} • {proj.client}</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
