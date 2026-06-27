import { useState } from "react";
import { INITIAL_PRODUCTS } from "../data";
import { Product } from "../types";
import { CheckCircle2, Download, HelpCircle, ArrowRight, Settings, Info, InfoIcon } from "lucide-react";

interface ProductsViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedProductForQuote: (productName: string) => void;
}

export default function ProductsView({ setCurrentTab, setSelectedProductForQuote }: ProductsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProduct, setActiveProduct] = useState<Product>(INITIAL_PRODUCTS[0]);

  const categories = ["All", "LED Film", "Glass Display", "Window Display", "Mesh Display"];

  const filteredProducts = selectedCategory === "All"
    ? INITIAL_PRODUCTS
    : INITIAL_PRODUCTS.filter(p => p.category === selectedCategory || (selectedCategory === "Mesh Display" && p.id.includes("curtain")));

  const handleQuoteRequest = (product: Product) => {
    setSelectedProductForQuote(product.name);
    setCurrentTab("quote");
  };

  return (
    <div id="products-page" className="bg-black text-white font-sans min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">STATE-OF-THE-ART HARDWARE</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Transparent LED Film Catalog</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover India's most certified see-through display line-up. Retain structural glass view while delivering high-brightness marketing content.
          </p>

          {/* Categories Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? "bg-red-600 border-red-500 text-white shadow-[0_4px_15px_rgba(227,6,19,0.3)]"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Layout - Split with Catalog on Left, Full Details on Right */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Product Selection Grid */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block font-bold">SELECT A PRODUCT SPECIFICATION</span>
              <div className="space-y-3">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setActiveProduct(prod)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      activeProduct.id === prod.id
                        ? "bg-red-600/10 border-red-500 shadow-[0_4px_20px_rgba(227,6,19,0.15)]"
                        : "bg-white/[0.01] border-white/5 hover:border-white/10"
                    }`}
                  >
                    {activeProduct.id === prod.id && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-600 rounded-l-xl" />
                    )}
                    <h3 className="font-bold text-sm text-white">{prod.name}</h3>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{prod.tagline}</p>
                    <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
                      <span className="bg-white/5 px-2 py-0.5 rounded font-mono uppercase text-red-500">{prod.category}</span>
                      <span className="text-gray-500 group-hover:text-white transition-colors flex items-center gap-1">
                        View Specs <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: In-Depth Product Overview & Specs Table */}
            <div className="lg:col-span-8 border border-white/10 bg-neutral-950 rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl relative">
              
              {/* Product Header */}
              <div className="border-b border-white/5 pb-6">
                <div className="flex items-center space-x-2 text-xs font-mono text-red-500 uppercase tracking-wider font-semibold mb-2">
                  <span>{activeProduct.category}</span>
                  <span>•</span>
                  <span>Premium Grade</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{activeProduct.name}</h2>
                <p className="text-sm italic text-gray-400 mt-2">{activeProduct.tagline}</p>
              </div>

              {/* Description & Core Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <InfoIcon className="w-4 h-4 text-red-500" />
                    OVERVIEW & BENEFITS
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{activeProduct.description}</p>
                  <div className="space-y-2 pt-2">
                    {activeProduct.benefits.map((ben, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-gray-300">{ben}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-red-500" />
                    KEY HARDWARE FEATURES
                  </h3>
                  <div className="space-y-3">
                    {activeProduct.features.map((feat, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/5 p-3 rounded-lg text-xs text-gray-400 leading-relaxed">
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">DETAILED TECHNICAL PARAMETERS</h3>
                <div className="border border-white/5 rounded-xl overflow-hidden bg-black text-xs font-mono">
                  <div className="grid grid-cols-2 border-b border-white/5 p-3 hover:bg-white/[0.01]">
                    <span className="text-gray-500">Pixel Pitch Options</span>
                    <span className="text-white text-right">{activeProduct.specifications.pitch}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/5 p-3 hover:bg-white/[0.01]">
                    <span className="text-gray-500">Transparency Ratio</span>
                    <span className="text-white text-right">{activeProduct.specifications.transparency}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/5 p-3 hover:bg-white/[0.01]">
                    <span className="text-gray-500">Brightness (Nits)</span>
                    <span className="text-white text-right">{activeProduct.specifications.brightness}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/5 p-3 hover:bg-white/[0.01]">
                    <span className="text-gray-500">Refresh Rate</span>
                    <span className="text-white text-right">{activeProduct.specifications.refreshRate}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/5 p-3 hover:bg-white/[0.01]">
                    <span className="text-gray-500">Thickness</span>
                    <span className="text-white text-right">{activeProduct.specifications.thickness}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/5 p-3 hover:bg-white/[0.01]">
                    <span className="text-gray-500">Cabinet Weight</span>
                    <span className="text-white text-right">{activeProduct.specifications.weight}</span>
                  </div>
                  <div className="grid grid-cols-2 p-3 hover:bg-white/[0.01]">
                    <span className="text-gray-500">Average Power Consumption</span>
                    <span className="text-white text-right">{activeProduct.specifications.avgPower}</span>
                  </div>
                </div>
              </div>

              {/* Installation & Maintenance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5 text-xs text-gray-400">
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider font-sans text-xs">Installation Manual Brief</h4>
                  <p className="leading-relaxed">{activeProduct.installation}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider font-sans text-xs">Maintenance & Support Brief</h4>
                  <p className="leading-relaxed">{activeProduct.maintenance}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 bg-white/[0.01] p-4 rounded-xl">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Download Technical Catalog</p>
                  <p className="text-[10px] text-gray-500">Product dimensions, guidelines & CAD drawings (PDF)</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert("Technical Catalog brochure download triggered successfully for: " + activeProduct.name); }}
                    className="bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center space-x-1.5"
                  >
                    <Download className="w-4 h-4 text-red-500" />
                    <span>Download Brochure</span>
                  </a>
                  <button
                    id="product-request-quote-btn"
                    onClick={() => handleQuoteRequest(activeProduct)}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-center"
                  >
                    Request Free Quote
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
