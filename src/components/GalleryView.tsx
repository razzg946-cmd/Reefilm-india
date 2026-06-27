import { useState } from "react";
import { Maximize2, PlayCircle, Eye, X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: "Photo" | "Video" | "Installation";
  url: string;
}

export default function GalleryView() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: "g1",
      title: "Adhesive LED Film applied on showroom glass",
      category: "Photo",
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "g2",
      title: "Corporate office multi-floor media facade",
      category: "Photo",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "g3",
      title: "Laying optical lamination on glass pane",
      category: "Installation",
      url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "g4",
      title: "Interactive curved pillars calibration",
      category: "Installation",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "g5",
      title: "Luxury jewelry store holographic display test",
      category: "Video",
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "g6",
      title: "Cabling and sub-controller framing details",
      category: "Installation",
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const filteredItems = activeTab === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <div id="gallery-page" className="bg-black text-white font-sans min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">MEDIA REPOSITORY</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Installation Gallery</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Inspect our high-resolution imagery and installation blueprints. See real glass display components up close.
          </p>

          {/* Categories Tab */}
          <div className="flex justify-center space-x-2 mt-8">
            {["All", "Photo", "Video", "Installation"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  activeTab === tab
                    ? "bg-red-600 border-red-500 text-white"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 cursor-pointer shadow-lg hover:border-white/20 transition-all"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between">
                    <span className="bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold">
                      {item.category}
                    </span>
                    {item.category === "Video" ? (
                      <PlayCircle className="w-5 h-5 text-red-500 animate-pulse" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-2">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Inspection Level: High Resolution</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden p-3 relative shadow-2xl">
            <div className="aspect-[16/10] bg-black rounded-lg overflow-hidden relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              
              {selectedImage.category === "Video" && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-red-600 animate-pulse cursor-pointer" onClick={() => alert("Simulated playback of premium: " + selectedImage.title)} />
                  <p className="text-xs font-mono text-gray-300 mt-4 uppercase tracking-widest">Streaming Ultra HD Demo Feed</p>
                </div>
              )}
            </div>
            
            <div className="p-4 flex items-center justify-between border-t border-white/5 mt-2">
              <div>
                <p className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold mb-1">{selectedImage.category} Showcase</p>
                <h3 className="text-sm font-bold text-white">{selectedImage.title}</h3>
              </div>
              <div className="text-[11px] font-mono text-gray-500">
                Authorized: Reefilm India
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
