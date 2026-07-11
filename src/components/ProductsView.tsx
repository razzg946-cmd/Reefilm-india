import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COMPANY_INFO } from "../data";
import { Product } from "../types";
import { 
  productSeriesList, 
  techHighlights, 
  ALL_TARGET_APPLICATIONS,
  ProductSeries
} from "../productData";
import { 
  CheckCircle2, 
  Download, 
  HelpCircle, 
  ArrowRight, 
  Settings, 
  Info, 
  Layers, 
  Eye, 
  Sun, 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  FileText, 
  MessageSquare, 
  PhoneCall, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Grid, 
  Activity, 
  Sliders, 
  Sparkles,
  Zap,
  Check,
  AlertCircle
} from "lucide-react";

import imgTransparentLed from "../assets/images/transparent_led_display_1782711533489.jpg";

interface ProductsViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedProductForQuote: (productName: string) => void;
  searchTerm?: string;
  setSearchTerm?: (val: string) => void;
  products?: Product[];
}

export default function ProductsView({ 
  setCurrentTab, 
  setSelectedProductForQuote, 
  searchTerm = "", 
  setSearchTerm,
  products = []
}: ProductsViewProps) {
  const [activeSeriesId, setActiveSeriesId] = useState<string>("o-series");
  const [selectedModelName, setSelectedModelName] = useState<string>("P4");
  const [activeGalleryTab, setActiveGalleryTab] = useState<"installation" | "closeup" | "application">("closeup");
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [simulatedVideoPlaying, setSimulatedVideoPlaying] = useState<boolean>(false);
  const [simulatedBrightness, setSimulatedBrightness] = useState<number>(85);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [activeMediaMode, setActiveMediaMode] = useState<"photo" | "video">("photo");

  // Combine static list with dynamic props products to reflect admin edits and new products
  const activeProducts = products || [];
  const processedSeriesList = [...productSeriesList].map(staticSeries => {
    // Try to find matching product in CMS state
    const matchedProduct = activeProducts.find(p => 
      p.id.replace(/-/g, "").toLowerCase() === staticSeries.id.replace(/-/g, "").toLowerCase()
    );

    if (matchedProduct) {
      // Return staticSeries overridden with CMS product values
      return {
        ...staticSeries,
        title: matchedProduct.name,
        category: matchedProduct.category,
        subtitle: matchedProduct.tagline,
        description: matchedProduct.description,
        mainImage: matchedProduct.image,
        highlights: matchedProduct.features || staticSeries.highlights,
        benefits: matchedProduct.benefits || staticSeries.benefits,
        videoUrl: matchedProduct.videoUrl || staticSeries.videoUrl,
        brochureUrl: matchedProduct.brochureUrl || staticSeries.brochureUrl,
        displayOrder: matchedProduct.displayOrder !== undefined ? matchedProduct.displayOrder : 99,
        specs: {
          ...staticSeries.specs,
          pixelPitch: matchedProduct.specifications?.pitch || staticSeries.specs.pixelPitch,
          brightness: matchedProduct.specifications?.brightness || staticSeries.specs.brightness,
          transparency: matchedProduct.specifications?.transparency || staticSeries.specs.transparency,
          thickness: matchedProduct.specifications?.thickness || staticSeries.specs.thickness,
          weight: matchedProduct.specifications?.weight || staticSeries.specs.weight,
          power: `Avg: ${matchedProduct.specifications?.avgPower || "220 W/㎡"}, Max: ${matchedProduct.specifications?.maxPower || "600 W/㎡"}`,
          refreshRate: matchedProduct.specifications?.refreshRate || staticSeries.specs.refreshRate
        }
      };
    }
    return staticSeries;
  });

  // Now, add any newly created products (where id doesn't match any static series)
  activeProducts.forEach(p => {
    const isNew = !productSeriesList.some(s => 
      s.id.replace(/-/g, "").toLowerCase() === p.id.replace(/-/g, "").toLowerCase()
    );

    if (isNew) {
      processedSeriesList.push({
        id: p.id,
        name: p.series || p.name.split(" ")[0] || p.name,
        category: p.category,
        title: p.name,
        subtitle: p.tagline,
        description: p.description,
        mainImage: p.image,
        highlights: p.features || [],
        benefits: p.benefits || [],
        applications: [
          "Glass Facades",
          "Curtain Wall Buildings",
          "Luxury Stores",
          "Shopping Malls",
          "Retail Stores",
          "Auto Showrooms"
        ],
        features: (p.features || []).map((featText) => ({
          title: featText.split(":")[0] || "Advanced Feature",
          description: featText.split(":")[1] || featText,
          icon: Cpu
        })),
        specs: {
          pixelPitch: p.specifications?.pitch || "N/A",
          brightness: p.specifications?.brightness || "N/A",
          transparency: p.specifications?.transparency || "N/A",
          thickness: p.specifications?.thickness || "2.0 mm",
          weight: p.specifications?.weight || "1.5 kg / ㎡",
          inputVoltage: "AC 110V – 240V, 50/60Hz",
          power: `Avg: ${p.specifications?.avgPower || "150W"}, Max: ${p.specifications?.maxPower || "450W"}`,
          angle: "H: 160° / V: 160°",
          refreshRate: p.specifications?.refreshRate || "≥ 3,840 Hz",
          grayscale: "16-Bit",
          temp: "-10°C to +60°C",
          humidity: "10% – 90% RH",
          controller: "Reefilm Sync Controller System",
          driveMode: "Static Constant Current Drive",
          lifespan: "100,000 Hours"
        },
        models: [
          { name: "P4", pitch: p.specifications?.pitch || "4.0 mm", viewingDistance: "≥ 4 Meters", brightness: p.specifications?.brightness || "3,500 cd/㎡", bestFor: p.tagline },
          { name: "Standard", pitch: p.specifications?.pitch || "8.0 mm", viewingDistance: "≥ 8 Meters", brightness: p.specifications?.brightness || "4,000 cd/㎡", bestFor: p.description }
        ],
        gallery: {
          closeup: [{ title: p.name + " closeup", img: p.image }],
          installation: [{ title: p.name + " installation", img: p.image }],
          application: [{ title: p.name + " application", img: p.image }]
        },
        installationGuide: [
          { step: "Step 1", title: "Glass Preparation", desc: p.installation || "Clean glass and peel backing." },
          { step: "Step 2", title: "Apply & Roll", desc: "Squeegee the self-adhesive film Core flat onto glass." }
        ],
        faqs: [
          { q: "How is it maintained?", a: p.maintenance || "Modular bypass diagnostics allow easy strip replacements." }
        ],
        videoUrl: p.videoUrl,
        brochureUrl: p.brochureUrl,
        displayOrder: p.displayOrder !== undefined ? p.displayOrder : 99
      } as any);
    }
  });

  // Sort the final list by displayOrder
  processedSeriesList.sort((a, b) => {
    const orderA = (a as any).displayOrder !== undefined ? (a as any).displayOrder : 99;
    const orderB = (b as any).displayOrder !== undefined ? (b as any).displayOrder : 99;
    return orderA - orderB;
  });

  const activeSeries = processedSeriesList.find(s => s.id === activeSeriesId) || processedSeriesList[0] || productSeriesList[0];
  const activeModel = activeSeries?.models ? (activeSeries.models.find(m => m.name === selectedModelName) || activeSeries.models[0]) : undefined;

  const generateAndDownloadPDF = (seriesName: string, docTitle: string, customLines: string[]) => {
    const dateStr = "July 2026";
    const partnerStr = "Official Partner: Reefilm India (Chennai)";
    const factoryStr = "China Factory: 3F, Building 2, Zhiying Science Park, Dongguan, China";
    const contactStr = "Support: razzg946@gmail.com | +91 8577917327";

    // Build PDF stream content lines
    const contentStream: string[] = [
      "BT",
      "/F1 16 Tf",
      "50 780 Td",
      `(${docTitle.replace(/[()]/g, "")}) Tj`,
      "/F1 10 Tf",
      "0 -25 Td",
      `(${partnerStr.replace(/[()]/g, "")}) Tj`,
      "0 -15 Td",
      `(${factoryStr.replace(/[()]/g, "")}) Tj`,
      "0 -15 Td",
      `(${contactStr.replace(/[()]/g, "")}) Tj`,
      "0 -15 Td",
      `(Date: ${dateStr}) Tj`,
      "0 -20 Td",
      "(--------------------------------------------------------------------------------) Tj",
    ];

    // Add the custom lines to the PDF body
    customLines.forEach((line) => {
      if (!line.trim()) {
        contentStream.push("0 -15 Td () Tj");
        return;
      }
      const cleanLine = line.replace(/[()]/g, "").slice(0, 95);
      contentStream.push(`0 -15 Td (${cleanLine}) Tj`);
    });

    contentStream.push("ET");

    const streamText = contentStream.join("\n");
    const streamLength = streamText.length;

    const pdfParts = [
      `%PDF-1.4\n`,
      `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
      `2 0 obj\n<< /Type /Pages /Kids [ 3 0 R ] /Count 1 >>\nendobj\n`,
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 595 842 ] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
      `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`,
      `5 0 obj\n<< /Length ${streamLength} >>\nstream\n`,
      streamText,
      `\nendstream\nendobj\n`,
      `xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000054 00000 n \n0000000109 00000 n \n0000000227 00000 n \n0000000295 00000 n \n`,
      `trailer\n<< /Size 6 /Root 1 0 R >>\n`,
      `startxref\n380\n`,
      `%%EOF`
    ];

    const blob = new Blob(pdfParts, { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    const safeDocName = docTitle.replace(/[^a-zA-Z0-9]/g, "_");
    link.download = `Reefilm_India_${safeDocName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerDocumentDownload = (docType: "Brochure" | "Datasheet" | "Installation" | "Warranty" | "Specifications", series: any) => {
    if (docType === "Brochure" && series.brochureUrl) {
      const link = document.createElement("a");
      link.href = series.brochureUrl;
      link.target = "_blank";
      link.download = `Reefilm_India_${series.name.replace(/[^a-zA-Z0-9]/g, "_")}_Brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadSuccessMessage(`Successfully downloading the brochure for ${series.name}!`);
      setTimeout(() => setDownloadSuccessMessage(null), 3500);
      return;
    }

    const customLines: string[] = [];
    let titleType = "";

    if (docType === "Brochure") {
      titleType = "Official Full-Series Product Catalogue";
      customLines.push("DOCUMENT ID: RF-CAT-2026-V42");
      customLines.push("STATUS: OFFICIAL COMPREHENSIVE PRODUCT CATALOGUE");
      customLines.push("");
      customLines.push("This document contains specifications for the complete Reefilm Product Lineup:");
      customLines.push("");
      customLines.push("1. O SERIES - Outdoor Commercial Glass Facades");
      customLines.push("   - Features: Ultra Thin, High Brightness (up to 5000 nits), Over 80% Transparency.");
      customLines.push("   - Applications: Malls, Luxury Retail, Corporate Facades, Airports.");
      customLines.push("");
      customLines.push("2. I-F SERIES - Flexible Curved Architectural Glass");
      customLines.push("   - Features: Ultra Flexible, Curved Columns, Creative Interiors.");
      customLines.push("   - Applications: Museums, Luxury Retail columns, Hotel Lobbies.");
      customLines.push("");
      customLines.push("3. I-R SERIES - Corporate & Meeting Room Partitions");
      customLines.push("   - Features: High Resolution (P2.5 / P3.97), Micro-Fine Pitch, Sleek Indoor Mount.");
      customLines.push("   - Applications: Meeting rooms, Corporate Glass Walls, Office Receptions.");
      customLines.push("");
      customLines.push("4. ESCALATOR SERIES - Shopping Mall Escalator Displays");
      customLines.push("   - Features: Dual-Side Synced Displays, Complete Safety Glass Mount.");
      customLines.push("   - Applications: Retail Shopping Malls, Transit Hubs, Airport Balustrades.");
      customLines.push("");
      customLines.push("5. HANDHELD SAMPLE SERIES - Portable Architect Demo Kit");
      customLines.push("   - Features: Durable Briefcase, Built-in SMT Controller & Battery pack.");
      customLines.push("   - Applications: Architect Demos, Consultant Sales Meetings, Investor Presentations.");
      customLines.push("");
      customLines.push("--------------------------------------------------------------------------");
      customLines.push("WARRANTY STATEMENT:");
      customLines.push("All Reefilm products purchased from certified channels in India are fully");
      customLines.push("supported by our 1-Year Official Local On-Site Diagnostics and Support Warranty.");
      customLines.push("");
      customLines.push("Note: Individual series-specific brochure is currently in printing. The current");
      customLines.push("file serves as the complete technical compilation for all series.");
    } else if (docType === "Datasheet") {
      titleType = `${series.name} - Technical Datasheet`;
      customLines.push(`DOCUMENT ID: RF-DS-${series.id.toUpperCase()}-2026`);
      customLines.push(`SERIES: REEFILM ${series.name.toUpperCase()}`);
      customLines.push(`CATEGORY: ${series.category.toUpperCase()}`);
      customLines.push("");
      customLines.push("TECHNICAL SPECIFICATIONS MATRIX:");
      customLines.push(`- Pixel Pitch: ${series.specs.pixelPitch || "N/A"}`);
      customLines.push(`- Brightness: ${series.specs.brightness || "N/A"}`);
      customLines.push(`- Transparency Rate: ${series.specs.transparency || "N/A"}`);
      customLines.push(`- Thickness: ${series.specs.thickness || "N/A"}`);
      customLines.push(`- Weight (Film Panel): ${series.specs.weight || "N/A"}`);
      customLines.push(`- Input Voltage: ${series.specs.inputVoltage || "N/A"}`);
      customLines.push(`- Max Power Consumption: ${series.specs.power || "N/A"}`);
      customLines.push(`- Refresh Rate: ${series.specs.refreshRate || "N/A"}`);
      customLines.push(`- Grayscale / Depth: ${series.specs.grayscale || "N/A"}`);
      customLines.push(`- Controller / Synchronizer: ${series.specs.controller || "N/A"}`);
      customLines.push(`- Display Lifespan: ${series.specs.lifespan || "N/A"}`);
      customLines.push("");
      customLines.push("AVAILABLE MODELS / PIXEL CONFIGURATIONS:");
      if (series.models && series.models.length > 0) {
        series.models.forEach((m: any) => {
          customLines.push(`  * Model ${m.name}: Pitch=${m.pitch}, Min Dist=${m.viewingDistance}, Brightness=${m.brightness}`);
        });
      }
    } else if (docType === "Installation") {
      titleType = `${series.name} - Professional Lamination & Installation Guide`;
      customLines.push(`DOCUMENT ID: RF-IG-${series.id.toUpperCase()}-2026`);
      customLines.push(`SERIES: REEFILM ${series.name.toUpperCase()}`);
      customLines.push("");
      customLines.push("STANDARD DRY-LAMINATION STEPS & REQUIREMENTS:");
      customLines.push("1. Glass Surface Preparation: Clean glass with 99% isopropyl alcohol.");
      customLines.push("2. Positioning & Alignment: Mark precise placement coordinates with laser level.");
      customLines.push("3. Protective backing removal: Peeling off the backing film incrementally.");
      customLines.push("4. Squeegee application: Start from top-center, scraping outward for bubble-free adhesion.");
      customLines.push("5. Flexible Circuit Connection: Link FPC strip to the side controller adapter.");
      customLines.push("6. Cable management: Tuck cables inside the edge metal profiles.");
      customLines.push("7. Power & Calibration: Perform a low-brightness start, then full color calibration.");
      customLines.push("");
      customLines.push("SERIES SPECIFIC STEPS:");
      if (series.installationGuide && series.installationGuide.length > 0) {
        series.installationGuide.forEach((step: any) => {
          customLines.push(`  * Step ${step.step}: ${step.title}`);
          customLines.push(`    Details: ${step.desc}`);
        });
      }
    } else if (docType === "Warranty") {
      titleType = "Official 1-Year Local Warranty Statement";
      customLines.push("DOCUMENT ID: RF-WARR-2026-V20");
      customLines.push("WARRANTY LEVEL: 1-YEAR PREMIUM LOCAL REPLACEMENT");
      customLines.push("");
      customLines.push("REEFILM INDIA OFFICIAL WARRANTY TERMS:");
      customLines.push("");
      customLines.push("1. Scope of Coverage:");
      customLines.push("   - Complete coverage on physical LED SMT film pixels.");
      customLines.push("   - Replacement of faulty receiving cards, senders, and hub-boards.");
      customLines.push("   - Direct replacement of faulty Meanwell power supply modules.");
      customLines.push("");
      customLines.push("2. Support SLAs:");
      customLines.push("   - Initial diagnostic response within 24 hours of ticket log.");
      customLines.push("   - Technical engineers deployed directly from Chennai Hub.");
      customLines.push("   - Spare module buffer stocked in Chennai for prompt dispatch.");
      customLines.push("");
      customLines.push("3. Terms of Validation:");
      customLines.push("   - Installation must be verified by a Reefilm-certified partner.");
      customLines.push("   - Power circuits must utilize the specified surge protection units.");
      customLines.push("   - Warranty is valid for 1 full year from the date of final sign-off.");
    } else if (docType === "Specifications") {
      titleType = `${series.name} - Detailed Technical Specifications`;
      customLines.push(`DOCUMENT ID: RF-SPEC-${series.id.toUpperCase()}-2026`);
      customLines.push(`SERIES: REEFILM ${series.name.toUpperCase()}`);
      customLines.push("");
      customLines.push("DETAILED HARDWARE SPECIFICATION MATRIX:");
      customLines.push(`- Cabinet-less Structure: Yes, self-adhesive backing (dry-lamination)`);
      customLines.push(`- Optical Grade UV Filter: Integrated (prevents yellowing of adhesive)`);
      customLines.push(`- Circuit Technology: Patented Micro-fine invisible circuit mesh`);
      customLines.push(`- Core Substrate: High-dielectric optical PET substrate`);
      customLines.push(`- Panel Thickness: ${series.specs.thickness || "N/A"}`);
      customLines.push(`- Panel Weight: ${series.specs.weight || "N/A"}`);
      customLines.push(`- Viewing Angles: Horizontal: 160 Deg / Vertical: 160 Deg`);
      customLines.push(`- Driver IC: Built-in constant current, energy-efficient high-refresh IC`);
      customLines.push(`- Expected Lifespan: ${series.specs.lifespan || "100,000 Hours"}`);
      customLines.push("");
      customLines.push("COMPLIANCE & TESTING STANDARDS:");
      customLines.push("- Electromagnetic Interference: FCC Class B, CE-EMC Compliant");
      customLines.push("- Environmental Compliance: RoHS Certified, UV Resistance Delta-E < 1.5");
      customLines.push("- Flame Retardancy: UL94 V-0 Grade Self-Extinguishing PET");
    }

    generateAndDownloadPDF(series.name, titleType, customLines);

    let succMsg = `Secure download of "${titleType}" has been started successfully.`;
    if (docType === "Brochure") {
      succMsg = `Official series-specific brochure will be available soon. The current download contains the complete Reefilm Product Catalogue.`;
    }
    setDownloadSuccessMessage(succMsg);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 8000);
  };

  const handleQuoteRequest = (seriesName: string) => {
    setSelectedProductForQuote(seriesName);
    setCurrentTab("quote");
    const quoteSec = document.getElementById("quote-section");
    if (quoteSec) {
      quoteSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="products-page" className="bg-black text-white font-sans min-h-screen selection:bg-red-600 selection:text-white pb-16">
      
      {/* 1. International Product Center Hero Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black via-neutral-950 to-black border-b border-white/5 overflow-hidden">
        {/* Glowing glass accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(227,6,19,0.06),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#E30613] font-bold flex items-center justify-center gap-2">
            <Cpu className="w-3.5 h-3.5 animate-pulse" /> REEFILM PRODUCT CENTER
          </p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-none">
            Next-Gen Transparent <br />
            <span className="bg-gradient-to-r from-white via-neutral-200 to-red-500 bg-clip-text text-transparent">LED Film Solutions</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed font-sans">
            Explore India’s most certified architectural transparent display line-up. Engineered with standard-setting lamination polymer, extreme brightness, and maximum thermal conductivity for high-end glass architecture.
          </p>

          {/* Premium Selector Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-w-6xl mx-auto mt-12 pt-6">
            {processedSeriesList.map((series) => {
              const isActive = series.id === activeSeriesId;
              return (
                <button
                  key={series.id}
                  onClick={() => {
                    setActiveSeriesId(series.id);
                    setSelectedModelName("P4");
                    setOpenFaqIdx(null);
                    setSimulatedVideoPlaying(false);
                    setActiveMediaMode("photo");
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all duration-300 group cursor-pointer ${
                    isActive
                      ? "bg-red-600/15 border-[#E30613] shadow-[0_10px_30px_rgba(227,6,19,0.15)]"
                      : "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider truncate block max-w-full ${isActive ? "text-[#FF5F6D]" : "text-gray-500"}`}>
                      {series.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <h3 className="text-xs font-black uppercase text-white truncate">{series.name}</h3>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-1 font-light">{series.category}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Detailed Product View Layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSeriesId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-16"
        >
          {/* Section A: Premium Product Hero & Brightness Simulator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image & Interactive Calibration Panel */}
            <div className="lg:col-span-6 space-y-6">
              {/* Media Selection Tab */}
              {(activeSeries as any).videoUrl && (
                <div className="flex bg-neutral-900/60 p-1 rounded-xl border border-white/5 max-w-xs">
                  <button
                    onClick={() => setActiveMediaMode("photo")}
                    className={`flex-1 text-center py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                      activeMediaMode === "photo"
                        ? "bg-[#E30613] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Interactive Photo
                  </button>
                  <button
                    onClick={() => setActiveMediaMode("video")}
                    className={`flex-1 text-center py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                      activeMediaMode === "video"
                        ? "bg-[#E30613] text-white shadow-md"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Product Video
                  </button>
                </div>
              )}

              <div className="relative aspect-[16/10] bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl group">
                {activeMediaMode === "video" && (activeSeries as any).videoUrl ? (
                  <div className="w-full h-full relative bg-black">
                    {((activeSeries as any).videoUrl.includes("youtube.com") || (activeSeries as any).videoUrl.includes("youtu.be")) ? (
                      <iframe
                        src={(activeSeries as any).videoUrl.includes("watch?v=") 
                          ? (activeSeries as any).videoUrl.replace("watch?v=", "embed/") 
                          : (activeSeries as any).videoUrl
                        }
                        title={`${activeSeries.name} Video Showcase`}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={(activeSeries as any).videoUrl}
                        controls
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                ) : (
                  <>
                    <img
                      src={activeSeries.mainImage}
                      alt={activeSeries.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      style={{
                        filter: `brightness(${simulatedBrightness}%) contrast(105%)`
                      }}
                    />
                    
                    {/* Calibration Overlay */}
                    <div 
                      className="absolute inset-0 bg-red-600/10 pointer-events-none transition-opacity duration-300 mix-blend-screen" 
                      style={{ opacity: (simulatedBrightness - 50) / 100 }}
                    />
    
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live Luminance Demo
                    </div>
    
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-mono text-gray-500 uppercase">Lamination Layer</p>
                        <p className="text-xs font-bold text-white">{activeSeries.specs.thickness} Core Depth</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-gray-500 uppercase">Transparency</p>
                        <p className="text-xs font-bold text-emerald-400">{activeSeries.specs.transparency}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Luminance Calibration controls */}
              <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#E30613]" /> Active Luminance Adjustment
                  </span>
                  <span className="text-white font-bold">{simulatedBrightness * 40} cd/㎡ (Nits)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-gray-500">Min (Dusk)</span>
                  <input
                    type="range"
                    min="35"
                    max="100"
                    value={simulatedBrightness}
                    onChange={(e) => setSimulatedBrightness(Number(e.target.value))}
                    className="flex-1 accent-red-600 h-1 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-red-500 font-bold">Max (Daylight)</span>
                </div>
              </div>
            </div>

            {/* General Description & Series Overview */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="bg-red-600/10 border border-[#E30613]/30 px-3 py-1 rounded-full text-[10px] font-mono text-[#FF5F6D] uppercase tracking-wider font-bold inline-block">
                  {activeSeries.category}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase text-white mt-3 tracking-tight">
                  {activeSeries.title}
                </h2>
                <p className="text-xs text-red-500 font-mono tracking-wider uppercase font-semibold mt-1">
                  {activeSeries.subtitle}
                </p>
              </div>

              {/* Product Overview Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Product Overview
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">
                  {activeSeries.description}
                </p>
              </div>

              {/* Product Highlights Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Product Highlights
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300 font-sans">
                  {activeSeries.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <Check className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Benefits Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Key Benefits
                </h3>
                <ul className="space-y-2 text-xs text-gray-400 font-sans">
                  {activeSeries.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => handleQuoteRequest(activeSeries.title)}
                  className="bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg shadow-red-600/10 cursor-pointer"
                >
                  Request Quote
                </button>
                <button
                  onClick={() => triggerDocumentDownload("Brochure", activeSeries)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase px-6 py-3 rounded-lg transition-all cursor-pointer"
                >
                  Download Brochure
                </button>
              </div>

            </div>
          </div>

          {/* Section B: Key Hardware Features (6-Item Bento) */}
          <div className="space-y-8 pt-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[10px] font-mono text-[#E30613] uppercase tracking-widest font-bold">Core Engineering Benefits</p>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">Key Product Features</h3>
              <p className="text-xs text-gray-400 mt-2">
                Pioneering self-adhesive transparent film technologies customized specifically for maximum clarity, flexibility, and daylong performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSeries.features.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl hover:border-red-600/30 hover:bg-white/[0.02] hover:shadow-[0_10px_30px_rgba(227,6,19,0.05)] transition-all duration-300 group relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E30613]/0 to-transparent group-hover:via-[#E30613]/40 transition-all duration-500" />
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-[#E30613]/10 group-hover:border-[#E30613]/20 transition-colors duration-300">
                      <FeatIcon className="w-5 h-5 text-gray-400 group-hover:text-[#FF5F6D] transition-colors duration-300" />
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-[#FF5F6D] transition-colors">{feat.title}</h4>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section C: Target Sector Applications Mapping */}
          <div className="space-y-8 pt-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-[10px] font-mono text-[#E30613] uppercase tracking-widest font-bold">Architectural Integration</p>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">14 Target Sector Applications Map</h3>
              <p className="text-xs text-gray-400 mt-2">
                See which environments are highly recommended for the <strong className="text-[#FF5F6D] font-bold">{activeSeries.name} Series</strong> technology.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {ALL_TARGET_APPLICATIONS.map((app) => {
                const isHighlyRecommended = activeSeries.applications.includes(app);
                return (
                  <div 
                    key={app} 
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 min-h-[110px] ${
                      isHighlyRecommended 
                        ? "bg-red-950/20 border-red-500/30 text-white shadow-[inset_0_1px_15px_rgba(227,6,19,0.05)]"
                        : "bg-white/[0.01] border-white/5 text-gray-500"
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-bold leading-tight ${isHighlyRecommended ? "text-white" : "text-gray-400"}`}>
                        {app}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                        isHighlyRecommended 
                          ? "bg-red-500/20 text-[#FF5F6D]" 
                          : "bg-white/5 text-gray-600"
                      }`}>
                        {isHighlyRecommended ? "Best Fit" : "Compatible"}
                      </span>
                      {isHighlyRecommended && <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section D: 15-Row Specifications & Available Models Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 items-start">
            
            {/* Technical Specifications Table */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">Technical Specifications</h3>
                <p className="text-xs text-gray-500 mt-1">Strict laboratory-verified parameters certified for Indian installations.</p>
              </div>

              <div className="border border-white/5 rounded-2xl overflow-hidden bg-white/[0.01] text-xs font-mono divide-y divide-white/5">
                {[
                  { label: "Pixel Pitch", val: activeSeries.specs.pixelPitch, highlight: false },
                  { label: "Brightness", val: activeSeries.specs.brightness, highlight: true },
                  { label: "Transparency", val: activeSeries.specs.transparency, highlight: true },
                  { label: "Thickness", val: activeSeries.specs.thickness, highlight: false },
                  { label: "Weight", val: activeSeries.specs.weight, highlight: false },
                  { label: "Input Voltage", val: activeSeries.specs.inputVoltage, highlight: false },
                  { label: "Power Consumption", val: activeSeries.specs.power, highlight: false },
                  { label: "Viewing Angle", val: activeSeries.specs.angle, highlight: false },
                  { label: "Refresh Rate", val: activeSeries.specs.refreshRate, highlight: true },
                  { label: "Grayscale", val: activeSeries.specs.grayscale, highlight: false },
                  { label: "Operating Temperature", val: activeSeries.specs.temp, highlight: false },
                  { label: "Humidity", val: activeSeries.specs.humidity, highlight: false },
                  { label: "Controller System", val: activeSeries.specs.controller, highlight: false },
                  { label: "Drive Mode", val: activeSeries.specs.driveMode, highlight: false },
                  { label: "Lifespan", val: activeSeries.specs.lifespan, highlight: false },
                ].map((spec, sidx) => (
                  <div key={sidx} className="grid grid-cols-2 p-3.5 hover:bg-white/[0.02] transition-colors">
                    <span className="text-gray-500 font-sans">{spec.label}</span>
                    <span className={`text-right font-mono font-bold ${spec.highlight ? "text-[#FF5F6D]" : "text-white"}`}>
                      {spec.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Models Details Panel */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">Available Models</h3>
                <p className="text-xs text-gray-500 mt-1">Select a model pitch class to inspect dynamic parameters.</p>
              </div>

              {!activeSeries?.models || activeSeries.models.length === 0 ? (
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-8 text-center space-y-2">
                  <p className="text-gray-400 font-medium text-sm">No models available for this product series.</p>
                  <p className="text-xs text-gray-500">Please check back later or contact us for customized configurations.</p>
                </div>
              ) : (
                <>
                  {/* Models Switch Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {activeSeries.models.map((model) => {
                      const isSelected = model.name === selectedModelName;
                      return (
                        <button
                          key={model.name}
                          onClick={() => setSelectedModelName(model.name)}
                          className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-[#E30613] border-[#E30613] text-white shadow-lg"
                              : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-white"
                          }`}
                        >
                          {model.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Model Details card */}
                  {activeModel ? (
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <span className="text-xs font-mono uppercase text-[#FF5F6D] font-bold">Model Configuration</span>
                        <span className="text-xl font-black text-white font-mono">{activeModel.name} Model</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] font-mono text-gray-500 uppercase">Actual Pixel Pitch</p>
                          <p className="text-sm font-bold text-white mt-1">{activeModel.pitch || "N/A"}</p>
                        </div>
                        <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] font-mono text-gray-500 uppercase">Optimal View Distance</p>
                          <p className="text-sm font-bold text-emerald-400 mt-1">{activeModel.viewingDistance || "N/A"}</p>
                        </div>
                        <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] font-mono text-gray-500 uppercase">Peak Model Brightness</p>
                          <p className="text-sm font-bold text-white mt-1">{activeModel.brightness || "N/A"}</p>
                        </div>
                        <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                          <p className="text-[10px] font-mono text-gray-500 uppercase">Recommended Deployment</p>
                          <p className="text-sm font-bold text-gray-300 mt-1">{activeModel.bestFor || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 text-center text-gray-500 text-xs">
                      No model configuration details selected.
                    </div>
                  )}
                </>
              )}

              {/* Installation Guide Step-by-Step Block */}
              <div className="space-y-4 pt-4">
                <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Self-Adhesive Installation Guide
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(activeSeries?.installationGuide || []).map((step, sidx) => (
                    <div key={sidx} className="bg-neutral-950/40 border border-white/5 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-red-500 font-black">{step.step}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                      </div>
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">{step.title}</h5>
                      <p className="text-[10px] text-gray-400 leading-normal">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Section E: Dedicated Clean Product Gallery */}
          <div className="space-y-6 pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-tight">LED Film Project Gallery</h3>
                <p className="text-xs text-gray-500 mt-1">Actual high-clarity installations and close-up active matrices.</p>
              </div>

              {/* Gallery Tabs */}
              <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5 gap-1 self-start md:self-auto">
                <button
                  onClick={() => { setActiveGalleryTab("closeup"); setSimulatedVideoPlaying(false); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-wider cursor-pointer ${
                    activeGalleryTab === "closeup" && !simulatedVideoPlaying
                      ? "bg-[#E30613] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Close-ups
                </button>
                <button
                  onClick={() => { setActiveGalleryTab("installation"); setSimulatedVideoPlaying(false); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-wider cursor-pointer ${
                    activeGalleryTab === "installation" && !simulatedVideoPlaying
                      ? "bg-[#E30613] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Installation
                </button>
                <button
                  onClick={() => { setActiveGalleryTab("application"); setSimulatedVideoPlaying(false); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-wider cursor-pointer ${
                    activeGalleryTab === "application" && !simulatedVideoPlaying
                      ? "bg-[#E30613] text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Applications
                </button>
                <button
                  onClick={() => setSimulatedVideoPlaying(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all tracking-wider cursor-pointer ${
                    simulatedVideoPlaying
                      ? "bg-[#E30613] text-white"
                      : "text-gray-400 hover:text-[#FF5F6D]"
                  }`}
                >
                  Video Test
                </button>
              </div>
            </div>

            {/* Gallery Display Panels */}
            <AnimatePresence mode="wait">
              {!simulatedVideoPlaying ? (
                <motion.div
                  key={activeGalleryTab}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {activeSeries.gallery[activeGalleryTab]?.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-neutral-900/40 shadow-xl"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <p className="text-xs font-mono uppercase tracking-wider text-white font-bold bg-red-600/90 px-3.5 py-1.5 rounded-lg">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="video-showroom"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-neutral-950 border border-white/10 rounded-2xl p-8 text-center space-y-6 max-w-3xl mx-auto"
                >
                  <div className="relative aspect-video max-w-2xl mx-auto bg-black rounded-xl overflow-hidden border border-white/5 flex items-center justify-center group shadow-2xl">
                    <img 
                      src={imgTransparentLed} 
                      alt="Active broadcast video test" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 filter saturate-120"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#E30613]/20 via-transparent to-cyan-500/10 pointer-events-none" />
                    
                    <div className="absolute top-4 right-4 bg-[#E30613]/10 border border-[#E30613]/40 px-2.5 py-1 rounded text-[8px] font-mono uppercase text-[#FF5F6D] font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      3,840 Hz Sync Locked
                    </div>

                    <div className="relative z-10 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30 transition-transform hover:scale-110 cursor-pointer">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white">Active Video Calibration Test</p>
                        <p className="text-[10px] font-mono text-gray-400 mt-1">High-Speed Broadcast Playback Sequence</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    * Displays complete flicker-free alignment under heavy camera filming conditions.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section F: 5-Column Enterprise Download Center */}
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 sm:p-10 space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(227,6,19,0.03),transparent_40%)] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h3 className="text-xl font-black uppercase text-white tracking-tight">Downloads & Technical Resources</h3>
                <p className="text-xs text-gray-400 mt-1">Get precise structural engineering data sheets, layout guides, and compliance certificates.</p>
              </div>
              <span className="text-[10px] font-mono uppercase text-red-500 font-bold bg-red-500/5 border border-red-500/20 px-3 py-1 rounded-full shrink-0">
                OFFICIAL DOWNLOAD PORTAL
              </span>
            </div>

            {downloadSuccessMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-600/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-400 font-mono text-center"
              >
                ✓ {downloadSuccessMessage}
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { 
                  title: "Product Brochure (PDF)", 
                  desc: "Complete design, configurations, and premium applications.", 
                  type: "Brochure" as const,
                  size: "4.8 MB",
                  version: "v4.2",
                  updated: "June 2026",
                  warning: "Official series-specific brochure will be available soon. The current download contains the complete Reefilm Product Catalogue."
                },
                { 
                  title: "Technical Datasheet", 
                  desc: "Detailed electrical loads, micro-circuits, and thermal limits.", 
                  type: "Datasheet" as const,
                  size: "2.1 MB",
                  version: "v3.9",
                  updated: "May 2026",
                  tag: "Specs Available"
                },
                { 
                  title: "Installation Guide", 
                  desc: "Step-by-step dry-lamination steps and cabling rules.", 
                  type: "Installation" as const,
                  size: "1.5 MB",
                  version: "v5.1",
                  updated: "April 2026",
                  tag: "Manual Available"
                },
                { 
                  title: "Warranty Information", 
                  desc: "Reefilm India Official 1-Year Warranty terms & support rules.", 
                  type: "Warranty" as const,
                  size: "450 KB",
                  version: "v2.0",
                  updated: "July 2026",
                  tag: "1-Year Warranty"
                },
                { 
                  title: "Product Specifications", 
                  desc: "Comprehensive model-by-model sizing, power, and configuration.", 
                  type: "Specifications" as const,
                  size: "1.2 MB",
                  version: "v1.5",
                  updated: "June 2026",
                  tag: "Full Matrix"
                },
              ].map((doc, idx) => (
                <div 
                  key={idx} 
                  className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between group hover:border-[#E30613]/30 transition-all duration-300 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl w-10 h-10 flex items-center justify-center text-red-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      {doc.tag ? (
                        <span className="text-[9px] font-mono font-bold text-red-500/80 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10">
                          {doc.tag}
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                          PDF BROCHURE
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">{doc.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{doc.desc}</p>
                    </div>

                    {doc.warning && (
                      <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-2.5 text-[9px] leading-relaxed text-red-400 font-sans">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 inline-block mr-1 align-text-bottom shrink-0 animate-pulse" />
                        {doc.warning}
                      </div>
                    )}

                    {/* File Information Section */}
                    <div className="pt-2 border-t border-white/5 space-y-1 text-[9px] font-mono text-gray-500">
                      <div className="flex justify-between">
                        <span>FORMAT:</span>
                        <span className="text-white">PDF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FILE SIZE:</span>
                        <span className="text-white">{doc.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VERSION:</span>
                        <span className="text-white">{doc.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>UPDATED:</span>
                        <span className="text-white">{doc.updated}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerDocumentDownload(doc.type, activeSeries)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-red-500/10 hover:text-white border border-white/5 hover:border-red-500/20 py-2 rounded-xl text-[10px] font-mono font-bold text-[#FF5F6D] transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>DOWNLOAD PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section G: 10 FAQs Accordion Panel */}
          <div className="space-y-6 pt-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Frequently Asked Questions</h3>
              <p className="text-xs text-gray-400 mt-1">Get precise, authoritative details on lamination, controllers, and support.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-3">
              {activeSeries.faqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div 
                    key={idx} 
                    className="bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-white uppercase tracking-wide hover:bg-white/[0.02] cursor-pointer"
                    >
                      <span className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                        {faq.q}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#FF5F6D]" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden border-t border-white/5 bg-black/40"
                        >
                          <div className="p-5 text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section H: Related Products (The other 4 products) */}
          <div className="space-y-6 pt-6">
            <h3 className="text-xl font-black uppercase text-white tracking-tight text-center md:text-left">Other Product Series</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productSeriesList
                .filter(s => s.id !== activeSeriesId)
                .map((series) => (
                  <div 
                    key={series.id}
                    onClick={() => {
                      setActiveSeriesId(series.id);
                      setSelectedModelName("P4");
                      setOpenFaqIdx(null);
                      setSimulatedVideoPlaying(false);
                      window.scrollTo({ top: 150, behavior: "smooth" });
                    }}
                    className="group bg-white/[0.01] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/30 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-black overflow-hidden relative">
                        <img 
                          src={series.mainImage} 
                          alt={series.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                          {series.name}
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-xs text-white group-hover:text-[#FF5F6D] transition-colors">{series.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{series.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-4 pt-0">
                      <span className="text-[10px] font-mono font-bold text-[#FF5F6D] uppercase flex items-center gap-1 group-hover:underline">
                        Explore Series &rarr;
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </motion.div>
      </AnimatePresence>

      {/* 3. Global Technology Highlights Section */}
      <section className="py-20 bg-neutral-950/60 border-y border-white/5 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <p className="text-[10px] font-mono text-[#E30613] uppercase tracking-widest font-bold">REEFILM RESEARCH & DEVELOPMENT</p>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">Proprietary Technology Highlights</h2>
            <p className="text-xs text-gray-400">
              Our advanced optoelectronic film centers in Dongguan and engineering offices in Chennai push the boundaries of glass displays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techHighlights.map((tech, idx) => {
              const TechIcon = tech.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-black/60 border border-white/5 p-6 rounded-2xl hover:border-red-500/20 transition-all duration-300 space-y-3"
                >
                  <div className="p-2.5 bg-red-600/10 border border-red-500/20 rounded-xl w-11 h-11 flex items-center justify-center text-[#FF5F6D]">
                    <TechIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">{tech.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{tech.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Side-By-Side Product Comparison Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <p className="text-[10px] font-mono text-[#E30613] uppercase tracking-widest font-bold">INTERACTIVE SPECIFICATION MATRIX</p>
            <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">Full Series Comparison Dashboard</h2>
            <p className="text-xs text-gray-400">
              Direct, unvarnished comparison of transparency, brightness, dimensions, and loads side-by-side.
            </p>
          </div>

          <div className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-950 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px] text-xs font-sans">
                <thead>
                  <tr className="bg-black border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    <th className="p-4 font-bold text-left">Specification Criteria</th>
                    <th className="p-4 text-center font-bold">O Series</th>
                    <th className="p-4 text-center font-bold">I-F Series</th>
                    <th className="p-4 text-center font-bold">I-R Series</th>
                    <th className="p-4 text-center font-bold">Escalator Series</th>
                    <th className="p-4 text-center font-bold">Handheld Series</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-400 font-mono text-[11px]">
                  
                  {/* Row 1: Transparency */}
                  <tr className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-white font-sans text-xs">Transparency</td>
                    <td className="p-4 text-center text-emerald-400 font-bold">90% – 94%</td>
                    <td className="p-4 text-center text-emerald-400">91% – 95%</td>
                    <td className="p-4 text-center text-emerald-400">88% – 92%</td>
                    <td className="p-4 text-center">85% – 90%</td>
                    <td className="p-4 text-center font-bold text-emerald-400">92%</td>
                  </tr>

                  {/* Row 2: Brightness */}
                  <tr className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-white font-sans text-xs">Brightness (Max)</td>
                    <td className="p-4 text-center text-white font-bold">4,000 cd/㎡</td>
                    <td className="p-4 text-center">3,500 cd/㎡</td>
                    <td className="p-4 text-center">3,800 cd/㎡</td>
                    <td className="p-4 text-center">3,000 cd/㎡</td>
                    <td className="p-4 text-center">2,500 cd/㎡</td>
                  </tr>

                  {/* Row 3: Pixel Pitch */}
                  <tr className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-white font-sans text-xs">Pixel Pitch</td>
                    <td className="p-4 text-center text-white">P4 / P8 / P10 / P15 / P20</td>
                    <td className="p-4 text-center text-white">P4 / P5 / P6.25 / P8</td>
                    <td className="p-4 text-center text-white">P4 / P5 / P6.25 / P8 / P10</td>
                    <td className="p-4 text-center">P6.25 / P8 / P10</td>
                    <td className="p-4 text-center">P4 / P8 (Dual Segment)</td>
                  </tr>

                  {/* Row 4: Thickness */}
                  <tr className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-white font-sans text-xs">Thickness</td>
                    <td className="p-4 text-center">2.0 mm</td>
                    <td className="p-4 text-center font-bold text-white">1.8 mm</td>
                    <td className="p-4 text-center">2.2 mm</td>
                    <td className="p-4 text-center">2.5 mm</td>
                    <td className="p-4 text-center">2.0 mm (Film Core)</td>
                  </tr>

                  {/* Row 5: Weight */}
                  <tr className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-white font-sans text-xs">Weight</td>
                    <td className="p-4 text-center">1.5 kg / ㎡</td>
                    <td className="p-4 text-center font-bold text-white">1.2 kg / ㎡</td>
                    <td className="p-4 text-center">1.6 kg / ㎡</td>
                    <td className="p-4 text-center">1.9 kg / ㎡</td>
                    <td className="p-4 text-center">3.5 kg (With Briefcase)</td>
                  </tr>

                  {/* Row 6: Power Consumption (Avg) */}
                  <tr className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-white font-sans text-xs">Power Consumption</td>
                    <td className="p-4 text-center text-white">220 W / ㎡</td>
                    <td className="p-4 text-center">180 W / ㎡</td>
                    <td className="p-4 text-center font-bold text-white">200 W / ㎡</td>
                    <td className="p-4 text-center text-emerald-400">150 W / ㎡</td>
                    <td className="p-4 text-center">Max 50W (Battery Mode)</td>
                  </tr>

                  {/* Row 7: Recommended Applications */}
                  <tr className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-white font-sans text-xs">Primary Applications</td>
                    <td className="p-4 text-center text-gray-400 font-sans text-[10px] leading-relaxed">
                      Glass Facades, Curtain Walls, Luxury Stores, Malls
                    </td>
                    <td className="p-4 text-center text-gray-400 font-sans text-[10px] leading-relaxed">
                      Curved Glass Bays, Columns, Museum Showcases, Arches
                    </td>
                    <td className="p-4 text-center text-gray-400 font-sans text-[10px] leading-relaxed">
                      Corporate Office Partitions, Boardrooms, Translucent Dividers
                    </td>
                    <td className="p-4 text-center text-gray-400 font-sans text-[10px] leading-relaxed">
                      Escalator Balustrades, Transit Dividers, Public Walkways
                    </td>
                    <td className="p-4 text-center text-gray-400 font-sans text-[10px] leading-relaxed">
                      Client Meetings, Trade Shows, Architect Boardrooms, Mobile Sales
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise CTA Block */}
      <section className="py-12 bg-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-neutral-950 via-[#E30613]/5 to-neutral-950 border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,6,19,0.05),transparent_50%)] pointer-events-none" />
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-[10px] font-mono text-[#FF5F6D] uppercase tracking-widest font-bold">READY TO UPGRADE YOUR GLASS INFRASTRUCTURE?</span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase text-white leading-tight">Get a Tailored Technical Consultation</h3>
            <p className="text-xs text-gray-400 font-sans">
              Connect directly with Reefilm India’s technical managers in Chennai to schedule live demonstrations, obtain template CAD details, and receive site structural evaluations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto relative z-10 pt-4">
            
            <button
              onClick={() => handleQuoteRequest(activeSeries.title)}
              className="col-span-2 md:col-span-1 bg-[#E30613] hover:bg-red-700 text-white p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-2 shadow-lg shadow-red-600/10 cursor-pointer transition-colors duration-300"
            >
              <FileText className="w-5 h-5 text-white" />
              <span>Request Quote</span>
            </button>

            <button
              onClick={() => triggerDocumentDownload("Brochure", activeSeries)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-5 h-5 text-[#FF5F6D]" />
              <span>Download Catalog</span>
            </button>

            <a
              href={`mailto:${COMPANY_INFO.indiaOffice.email}?subject=Inquiry about Reefilm ${activeSeries.name}`}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Cpu className="w-5 h-5 text-red-400" />
              <span>Contact Engineer</span>
            </a>

            <a
              href={`tel:${COMPANY_INFO.indiaOffice.phone.replace(/\s+/g, "")}`}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <PhoneCall className="w-5 h-5 text-emerald-400" />
              <span>Call Now</span>
            </a>

            <a
              href={`https://wa.me/${COMPANY_INFO.indiaOffice.whatsapp.replace(/[^0-9]/g, "")}?text=Hi Reefilm India, I am interested in learning more about the ${activeSeries.title}. Please provide model specifics.`}
              target="_blank"
              rel="noreferrer"
              className="col-span-2 md:col-span-1 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>WhatsApp Chat</span>
            </a>

          </div>

          <div className="pt-6 text-xs text-gray-500 font-mono flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <span>Lead Partner: <strong>{COMPANY_INFO.indiaOffice.contactPerson}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Chennai Support Office: <strong>{COMPANY_INFO.indiaOffice.hours}</strong></span>
          </div>
        </div>
      </section>

    </div>
  );
}
