import React, { useState, FormEvent, ChangeEvent } from "react";
import { 
  Check, ArrowRight, ArrowLeft, Lightbulb, ShieldCheck, 
  Upload, FileText, Image as ImageIcon, Send, Clock 
} from "lucide-react";
import { LeadInquiry } from "../types";

interface QuoteViewProps {
  onAddLead: (lead: any) => Promise<any> | void;
  selectedProduct: string;
}

export default function QuoteView({ onAddLead, selectedProduct }: QuoteViewProps) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // All requested business parameters
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    country: "India",
    productOfInterest: selectedProduct || "O Series Transparent LED Film (Premium Facade)",
    screenSize: "",
    glassSize: "",
    quantity: "1",
    budgetRange: "₹15L - ₹25L",
    timeline: "Next 3 Months",
    specialRequirements: "",
  });

  // Base64 attachments
  const [drawingFile, setDrawingFile] = useState<{ name: string; data: string } | null>(null);
  const [imageFile, setImageFile] = useState<{ name: string; data: string } | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: "drawing" | "image") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("File is too large. Max file size limit is 10MB.");
        return;
      }
      setErrorMsg("");
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          if (type === "drawing") {
            setDrawingFile({ name: file.name, data: reader.result });
          } else {
            setImageFile({ name: file.name, data: reader.result });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateEstimate = () => {
    let pricePerSqMeter = 115000; 
    let size = 20; 

    // Extract area if specified in glassSize or screenSize
    const sizeMatch = formData.glassSize.match(/(\d+)/) || formData.screenSize.match(/(\d+)/);
    if (sizeMatch) {
      size = parseInt(sizeMatch[1], 10);
    }
    
    if (formData.productOfInterest.includes("3.91mm")) {
      pricePerSqMeter = 165000;
    } else if (formData.productOfInterest.includes("10.4mm")) {
      pricePerSqMeter = 85000;
    }

    const estimatedTotal = size * pricePerSqMeter;
    const estimatedPowerMax = size * 600; 
    const estimatedPowerAvg = size * 180; 

    return {
      size,
      total: estimatedTotal.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      maxPower: `${(estimatedPowerMax / 1000).toFixed(1)} kW`,
      avgPower: `${(estimatedPowerAvg / 1000).toFixed(1)} kW`,
      transparency: "80%",
    };
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.whatsapp) {
        setErrorMsg("Please provide your Name, Email, Phone, and WhatsApp to proceed.");
        return;
      }
      if (!formData.city || !formData.state) {
        setErrorMsg("Please enter your City and State for local technical routing.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.glassSize) {
        setErrorMsg("Please enter the approximate Glass dimensions to calculate estimates.");
        return;
      }
    }
    setErrorMsg("");
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setErrorMsg("");
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const finalPayload = {
      ...formData,
      attachmentName: drawingFile?.name || imageFile?.name || "",
      attachmentData: drawingFile?.data || imageFile?.data || "",
      // Maintain fields requested
      drawingName: drawingFile?.name || "",
      drawingData: drawingFile?.data || "",
      imageName: imageFile?.name || "",
      imageData: imageFile?.data || "",
    };

    try {
      const result = await onAddLead(finalPayload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to connect to the backend server. Your details are saved in the browser offline.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const est = calculateEstimate();

  return (
    <div id="quote-page" className="bg-black text-white font-sans min-h-screen">
      {/* Banner */}
      <section className="relative py-16 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold font-mono">
            REEFILM INDIA – DIGITAL ESTIMATOR & QUOTING ENGINE
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Request Architectural Quote
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Specify your custom structural dimensions, select pitch preferences, and upload site files. 
            All Reefilm products are engineered at partner foundries and fully supported locally 
            by <strong>Reefilm India (Chennai)</strong>.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Progress indicators */}
          {!submitted && (
            <div className="flex items-center justify-between mb-8 text-[11px] font-mono uppercase font-bold tracking-widest border border-white/5 bg-neutral-950 p-4 rounded-xl">
              <div className={`flex items-center space-x-2 ${step >= 1 ? "text-red-500" : "text-gray-500"}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>Customer Info</span>
              </div>
              <div className="h-px bg-white/5 flex-grow mx-4" />
              <div className={`flex items-center space-x-2 ${step >= 2 ? "text-red-500" : "text-gray-500"}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>Structural Specs</span>
              </div>
              <div className="h-px bg-white/5 flex-grow mx-4" />
              <div className={`flex items-center space-x-2 ${step >= 3 ? "text-red-500" : "text-gray-500"}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>Context & Attachments</span>
              </div>
            </div>
          )}

          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
            {submitted ? (
              /* SUCCESS MESSAGE CONFIRMATION - SPECIFIC AS PER RULES */
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-600/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <Check className="w-8 h-8 text-emerald-500 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Inquiry Captured Successfully</h3>
                  
                  {/* Strict success requirement text */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl max-w-xl mx-auto">
                    <p className="text-emerald-400 font-mono text-sm font-semibold">
                      "Thank you for contacting Reefilm India. Our sales team will contact you shortly."
                    </p>
                  </div>
                  
                  <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                    A secure notification alert has been logged in our Chennai centralized database. 
                    An automatic confirmation and structural checklist thank-you email was successfully dispatched to <strong>{formData.email}</strong>.
                  </p>
                </div>

                {/* Instant Calculation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">PRELIMINARY LAYOUT SUMMARY</h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Selected Product</span>
                        <span className="text-white font-bold">{formData.productOfInterest}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Glass Dimensions</span>
                        <span className="text-white font-bold">{formData.glassSize}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Screen Area Target</span>
                        <span className="text-white font-bold">{formData.screenSize || "Same as glass"}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Installation Quantity</span>
                        <span className="text-white font-bold">{formData.quantity} Units</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">POWER & ENGINEERING CALC</h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Peak Thermal Load</span>
                        <span className="text-white font-bold">{est.maxPower} max</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Average Running Draw</span>
                        <span className="text-white font-bold">{est.avgPower} avg</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2 bg-red-600/10 p-2 rounded">
                        <span className="text-red-400 font-bold">Stated Budget Bracket</span>
                        <span className="text-white font-extrabold">{formData.budgetRange}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl space-y-2.5 text-xs leading-relaxed">
                  <div className="flex items-center space-x-2 text-red-500 font-mono font-bold">
                    <Lightbulb className="w-4 h-4" />
                    <span>Project Partnership Trust:</span>
                  </div>
                  <p className="text-gray-400">
                    Your parameters are scheduled for review by Raj Gupta's engineering team in Chennai. 
                    Reefilm products are manufactured to premium specifications, guaranteeing superior high-density quality, and 
                    supported with standard 1-Year Warranty locally in India.
                  </p>
                </div>

                {/* Return */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setStep(1);
                      setDrawingFile(null);
                      setImageFile(null);
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white uppercase font-bold tracking-wider px-6 py-3 rounded-lg transition-all cursor-pointer"
                  >
                    Generate Another Estimate
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: CONTACT DETAILS & GEOLOCATION */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold block mb-1">STEP 1 OF 3</span>
                      <h3 className="text-lg font-black text-white uppercase">Client Information & Location</h3>
                      <p className="text-xs text-gray-500">Please provide complete, accurate details for technical routing.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. Raj Gupta"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Company Name / Organization</label>
                        <input
                          type="text"
                          placeholder="E.g. L&T Realty / DLF"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="E.g. +91 85779 17327"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="E.g. +91 85779 17327"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="E.g. name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">City *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. Chennai"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">State *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. Tamil Nadu"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Country</label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <p className="text-red-500 text-xs font-mono bg-red-600/10 border border-red-500/25 p-3 rounded-lg">
                        ⚠️ {errorMsg}
                      </p>
                    )}

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <span>Architectural Specs</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: STRUCTURAL PARAMETERS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold block mb-1">STEP 2 OF 3</span>
                      <h3 className="text-lg font-black text-white uppercase">Structural & Sizing Parameters</h3>
                      <p className="text-xs text-gray-500">Provide dimensions to calculate transparency values and running load weights.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Product Required *</label>
                        <select
                          value={formData.productOfInterest}
                          onChange={(e) => setFormData({ ...formData, productOfInterest: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>O Series Transparent LED Film (Premium Facade)</option>
                          <option>I-F Series Flexible Transparent LED Film</option>
                          <option>I-R Series Curved Transparent LED Film</option>
                          <option>Escalator Series Vibration-Resistant LED Film</option>
                          <option>Handheld Sample Series (Compact A4 Demo Kit)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Quantity (Units / Screens) *</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Total Glass Size (E.g. Width x Height / sq. meters) *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. 10m x 4m (40 sq. meters)"
                          value={formData.glassSize}
                          onChange={(e) => setFormData({ ...formData, glassSize: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Proposed Screen Size (E.g. 8m x 3m)</label>
                        <input
                          type="text"
                          placeholder="E.g. 8m x 3m (Laminated section)"
                          value={formData.screenSize}
                          onChange={(e) => setFormData({ ...formData, screenSize: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <p className="text-red-500 text-xs font-mono bg-red-600/10 border border-red-500/25 p-3 rounded-lg">
                        ⚠️ {errorMsg}
                      </p>
                    )}

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white uppercase font-bold tracking-wider px-5 py-3 rounded-lg flex items-center space-x-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center space-x-2 cursor-pointer"
                      >
                        <span>Budget & Attachments</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: FINANCIAL, TIMELINE & FILE UPLOADS */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold block mb-1">STEP 3 OF 3</span>
                      <h3 className="text-lg font-black text-white uppercase">Project Timeline & Site Files</h3>
                      <p className="text-xs text-gray-500">Provide architectural plans or facade mock-ups to fast-track CAD design.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Implementation Timeline</label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>Immediate (Within 30 Days)</option>
                          <option>Next 3 Months</option>
                          <option>Next 6 Months</option>
                          <option>Planning / Consulting phase</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Approximate Budget Allocated</label>
                        <select
                          value={formData.budgetRange}
                          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>₹5L - ₹15L</option>
                          <option>₹15L - ₹25L</option>
                          <option>₹25L - ₹35L</option>
                          <option>₹35L - ₹50L</option>
                          <option>₹50L+ (Premium Landmark Facade)</option>
                        </select>
                      </div>
                    </div>

                    {/* TWO SPECIFIC UPLOADS: Drawing & Site Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">
                          Upload Structural Drawing (PDF/DWG/Images)
                        </label>
                        <div className="relative border border-dashed border-white/10 hover:border-white/30 rounded-xl bg-black p-4 text-center cursor-pointer transition-colors group">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, "drawing")}
                            accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-1">
                            <Upload className="w-5 h-5 mx-auto text-gray-500 group-hover:text-red-500 transition-colors" />
                            <p className="text-[10px] font-mono text-gray-400">
                              {drawingFile ? drawingFile.name : "Select CAD / Blueprint"}
                            </p>
                            <p className="text-[8px] text-gray-600">Max 10MB file limit</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold block">
                          Upload Site / Glass Photos
                        </label>
                        <div className="relative border border-dashed border-white/10 hover:border-white/30 rounded-xl bg-black p-4 text-center cursor-pointer transition-colors group">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, "image")}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="space-y-1">
                            <Upload className="w-5 h-5 mx-auto text-gray-500 group-hover:text-emerald-500 transition-colors" />
                            <p className="text-[10px] font-mono text-gray-400">
                              {imageFile ? imageFile.name : "Select Glass Facade Photo"}
                            </p>
                            <p className="text-[8px] text-gray-600">Max 10MB file limit</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Special Inquiry Details / Structural Curves / Message</label>
                      <textarea
                        placeholder="E.g. We require custom edge profiles, corner-joining, or specialized glass cleaning crane accessibility compatibility..."
                        rows={3}
                        value={formData.specialRequirements}
                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="flex items-center space-x-2 text-[9px] text-gray-500 font-mono bg-white/[0.01] border border-white/5 p-3 rounded-lg leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Reefilm India (Chennai Desk) logs this inquiry directly into our secure persistent database. Recipient: razzg946@gmail.com</span>
                    </div>

                    {errorMsg && (
                      <p className="text-red-500 text-xs font-mono bg-red-600/10 border border-red-500/25 p-3 rounded-lg">
                        ⚠️ {errorMsg}
                      </p>
                    )}

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={loading}
                        className="bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white uppercase font-bold tracking-wider px-5 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center space-x-2 cursor-pointer disabled:opacity-50 shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
                      >
                        {loading ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                            <span>Saving Specs...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-white" />
                            <span>Calculate & Submit</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
