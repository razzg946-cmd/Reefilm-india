import { useState } from "react";
import { PlayCircle, X, Sliders, Cpu, Eye, Layers, Check } from "lucide-react";
import { GalleryItem, WebsiteSettings } from "../types";

interface GalleryViewProps {
  galleryItems: GalleryItem[];
  settings?: WebsiteSettings;
}

export default function GalleryView({ galleryItems, settings }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [simulateBrightness, setSimulateBrightness] = useState<number>(85);
  const [simulateTransparency, setSimulateTransparency] = useState<number>(90);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const categories = [
    "All",
    "Storefronts & Entrances",
    "Interior Glass Partitioning",
    "Digital Displays",
    "Hardware & Installation"
  ];

  // Separate real and demo items
  const realItems = galleryItems.filter(item => !item.isDemo);
  const demoItems = galleryItems.filter(item => item.isDemo);

  // Determine what items to display based on whether real items exist
  let displayedItems: GalleryItem[] = [];
  if (realItems.length > 0) {
    if (settings?.hideDemoGallery) {
      displayedItems = realItems;
    } else {
      displayedItems = [...realItems, ...demoItems];
    }
  } else {
    displayedItems = demoItems;
  }

  const filteredItems = selectedCategory === "All"
    ? displayedItems
    : displayedItems.filter((item) => item.category === selectedCategory);

  return (
    <div id="gallery-page" className="bg-black text-white font-sans min-h-screen">
      {/* Premium Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(227,6,19,0.05),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> REEFILM INDIA PORTFOLIO
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Architectural Project Gallery
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Explore our professional glass and display installations across India. Select a category below to filter landmark corporate storefronts, interior glass partitions, digital displays, and precision hardware setups.
          </p>

          {/* Categories Filter Selector */}
          <div className="flex overflow-x-auto scrollbar-none py-3 justify-start lg:justify-center gap-2 mt-8 -mx-4 px-4">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === tab
                    ? "bg-[#E30613] border-[#E30613] text-white shadow-lg shadow-red-600/15"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Installations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-neutral-900/50 cursor-pointer shadow-lg hover:border-red-500/30 transition-all duration-300"
              >
                {item.isDemo && (
                  <div className="absolute top-3 right-3 z-10 bg-amber-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider shadow">
                    Demo Content
                  </div>
                )}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-gray-500 text-xs">
                    Image Not Available
                  </div>
                )}

                {/* Ambient glass flare / reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none opacity-40 group-hover:translate-x-full transition-transform duration-1000" />

                {/* Hover overlay containing details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold">
                      {item.category}
                    </span>
                    <span className="bg-white/10 text-white px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold flex items-center gap-1">
                      <Layers className="w-3 h-3" /> SPEC RATED
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 font-mono">
                      {item.location}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center text-[10px] text-red-400 font-mono font-bold uppercase mt-3 group-hover:underline">
                      View Calibration Specs &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500 font-mono text-xs">
                No items found for this category. Reefilm India is updating active portfolio logs.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox / Project Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-neutral-950 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative my-8">
            {/* Close Modal button */}
            <button
              onClick={() => {
                setSelectedItem(null);
                setIsSimulating(false);
              }}
              className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white p-2 rounded-full bg-black/60 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Media Preview Column */}
              <div className="md:col-span-7 bg-black flex flex-col justify-center relative aspect-video md:aspect-auto min-h-[300px]">
                {selectedItem.imageUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                      style={{
                        filter: isSimulating 
                          ? `brightness(${simulateBrightness}%) opacity(${simulateTransparency}%)` 
                          : "none"
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Simulation overlays */}
                    {isSimulating && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-red-500/10 pointer-events-none mix-blend-screen animate-pulse" />
                    )}

                    {!isSimulating && (
                      <button 
                        onClick={() => setIsSimulating(true)}
                        className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center bg-black/50 hover:bg-red-600 hover:scale-105 border border-white/20 text-white rounded-full transition-all group/play cursor-pointer"
                      >
                        <PlayCircle className="w-10 h-10 group-hover/play:text-white" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-neutral-900 text-gray-500 font-mono text-xs">
                    No preview available
                  </div>
                )}
              </div>

              {/* Data Specifications & Calibration Column */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-neutral-900/20">
                <div className="space-y-6">
                  <div>
                    <span className="bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold inline-block">
                      {selectedItem.category} Specs
                    </span>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight mt-3">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-red-500 font-mono mt-1 font-bold">
                      {selectedItem.location}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {/* Core Technical Specifications Table */}
                  <div className="border-t border-white/5 pt-4">
                    <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden text-[10px] font-mono text-gray-400 divide-y divide-white/5">
                      {selectedItem.client && (
                        <div className="p-3 flex justify-between items-center">
                          <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-red-500" /> Client Partner</span>
                          <span className="text-white font-bold">{selectedItem.client}</span>
                        </div>
                      )}
                      {selectedItem.timeline && (
                        <div className="p-3 flex justify-between items-center">
                          <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-red-500" /> Installation Timeline</span>
                          <span className="text-white font-bold">{selectedItem.timeline}</span>
                        </div>
                      )}
                      <div className="p-3 flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-red-500" /> Glass Layout</span>
                        <span className="text-white font-bold">{selectedItem.specs.layers}</span>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-red-500" /> Transmittance</span>
                        <span className="text-emerald-400 font-bold">{selectedItem.specs.transmission}</span>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-red-500" /> Controller standard</span>
                        <span className="text-white font-bold">{selectedItem.specs.controller}</span>
                      </div>
                      <div className="p-3 flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-400" /> Dimension</span>
                        <span className="text-white font-bold">{selectedItem.specs.dimensions}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Simulation controls */}
                  {isSimulating && (
                    <div className="bg-black/60 border border-red-500/15 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                        <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-red-500" /> Interactive calibration</span>
                        <button 
                          onClick={() => setIsSimulating(false)}
                          className="text-red-400 hover:text-red-300 font-bold uppercase text-[9px]"
                        >
                          Exit
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-mono text-gray-500">
                          <span>Simulated Brightness</span>
                          <span className="text-white">{simulateBrightness}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="100" 
                          value={simulateBrightness} 
                          onChange={(e) => setSimulateBrightness(parseInt(e.target.value))}
                          className="w-full accent-red-600 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-mono text-gray-500">
                          <span>Simulated Transparency</span>
                          <span className="text-white">{simulateTransparency}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="50" 
                          max="100" 
                          value={simulateTransparency} 
                          onChange={(e) => setSimulateTransparency(parseInt(e.target.value))}
                          className="w-full accent-red-600 h-1 bg-white/10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Interactive CTA to quote section */}
                <div className="border-t border-white/5 pt-6 mt-6">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setIsSimulating(false);
                      const quoteSection = document.getElementById("quote-section");
                      if (quoteSection) {
                        quoteSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all cursor-pointer text-center block shadow-lg shadow-red-600/15"
                  >
                    Request Technical Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
