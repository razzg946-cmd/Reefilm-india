import React, { useState, FormEvent } from "react";
import { Check, ArrowRight, ArrowLeft, HelpCircle, FileSpreadsheet, Percent, Lightbulb, UserCheck, ShieldCheck } from "lucide-react";
import { LeadInquiry } from "../types";

interface QuoteViewProps {
  onAddLead: (lead: Omit<LeadInquiry, "id" | "status" | "createdAt">) => void;
  selectedProduct: string;
}

export default function QuoteView({ onAddLead, selectedProduct }: QuoteViewProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    role: "Architect / Consultant",
    productOfInterest: selectedProduct || "Transparent LED Film (Adhesive)",
    pixelPitchPreference: "6.25mm",
    glassSize: "10m x 3m (30 sq. meters)",
    projectLocation: "",
    timeline: "Next 3 Months",
    budgetRange: "₹25L - ₹35L",
    specialRequirements: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Estimator Calculations for instant interactive report
  const calculateEstimate = () => {
    let pricePerSqMeter = 115000; // Average ₹1.15L per sq meter
    let sizeMatch = formData.glassSize.match(/(\d+)\s*sq/i) || formData.glassSize.match(/(\d+)/);
    let size = sizeMatch ? parseInt(sizeMatch[1]) : 20;
    
    if (formData.pixelPitchPreference === "3.91mm") {
      pricePerSqMeter = 165000;
    } else if (formData.pixelPitchPreference === "10.4mm") {
      pricePerSqMeter = 85000;
    }

    const estimatedTotal = size * pricePerSqMeter;
    const estimatedPowerMax = size * 600; // 600W max
    const estimatedPowerAvg = size * 180; // 180W avg

    return {
      size,
      total: estimatedTotal.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
      maxPower: `${(estimatedPowerMax / 1000).toFixed(1)} kW`,
      avgPower: `${(estimatedPowerAvg / 1000).toFixed(1)} kW`,
      transparency: formData.pixelPitchPreference === "3.91mm" ? "75%" : "85%",
    };
  };

  const handleNext = () => {
    if (step === 1 && (!formData.fullName || !formData.email || !formData.phone)) {
      alert("Please provide your name, phone, and email to proceed to the structural steps.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddLead({
      ...formData,
    });
    setSubmitted(true);
  };

  const est = calculateEstimate();

  return (
    <div id="quote-page" className="bg-black text-white font-sans min-h-screen">
      {/* Banner */}
      <section className="relative py-16 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold font-mono">B2B BUDGETING SYSTEM</p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Estimate Your Digital Facade</h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto">
            Answer a few quick structural questions to generate an immediate estimated engineering outline.
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
                <span>Contact Details</span>
              </div>
              <div className="h-px bg-white/5 flex-grow mx-4" />
              <div className={`flex items-center space-x-2 ${step >= 2 ? "text-red-500" : "text-gray-500"}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>Architectural parameters</span>
              </div>
              <div className="h-px bg-white/5 flex-grow mx-4" />
              <div className={`flex items-center space-x-2 ${step >= 3 ? "text-red-500" : "text-gray-500"}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>Project Estimates</span>
              </div>
            </div>
          )}

          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              /* IMMEDIATE ESTIMATE REPORT ON THANK YOU PAGE */
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-600/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Estimated Report Generated</h3>
                  <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                    Thank you! Your parameters have been received. Reefilm India has synthesized the following preliminary engineering matrix for: <strong>{formData.company || formData.fullName}</strong>.
                  </p>
                </div>

                {/* Instant Calculation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">ESTIMATED PARAMETERS</h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Selected Display</span>
                        <span className="text-white font-bold">{formData.productOfInterest}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Pixel Pitch Preference</span>
                        <span className="text-white font-bold">{formData.pixelPitchPreference}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Target Area</span>
                        <span className="text-white font-bold">{est.size} sq. meters</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Estimated Transparency</span>
                        <span className="text-white font-bold">{est.transparency} See-through</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">POWER & FINANCIAL ESTIMATE</h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Peak Power Load</span>
                        <span className="text-white font-bold">{est.maxPower} max</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500">Average Operational Load</span>
                        <span className="text-white font-bold">{est.avgPower} avg</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-2 bg-red-600/10 p-2 rounded">
                        <span className="text-red-400 font-bold">Project Budget Range</span>
                        <span className="text-white font-extrabold">{formData.budgetRange}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-5 rounded-xl space-y-3 text-xs leading-relaxed">
                  <div className="flex items-center space-x-2 text-red-500 font-mono font-bold">
                    <Lightbulb className="w-4 h-4" />
                    <span>Raj Gupta's Engineering Recommendation:</span>
                  </div>
                  <p className="text-gray-400">
                    We suggest allocating a dedicated 3-phase power line with an automatic voltage stabilizer. A <strong>{formData.pixelPitchPreference}</strong> pitch is excellent for your target view. We will send you a complete CAD simulation blueprint via email shortly.
                  </p>
                </div>

                {/* Return */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setStep(1);
                    }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white uppercase font-bold tracking-wider px-6 py-3 rounded-lg"
                  >
                    Generate Another Estimate
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* STEP 1: CONTACT DETAILS */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold block mb-1">STEP 1 OF 3</span>
                      <h3 className="text-lg font-black text-white uppercase">Client Information Desk</h3>
                      <p className="text-xs text-gray-500">Your details remain strictly confidential and protected.</p>
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
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Corporate Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Direct Phone / Mobile *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 99887 76655"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Company / Organization</label>
                        <input
                          type="text"
                          placeholder="L&T Realty / DLF"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Your Professional Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      >
                        <option>Architect / Consultant</option>
                        <option>Interior Designer</option>
                        <option>Retail Franchise Owner</option>
                        <option>Corporate Real Estate Manager</option>
                        <option>Direct Customer</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center space-x-2"
                      >
                        <span>Architectural Specs</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: ARCHITECTURAL PARAMETERS */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold block mb-1">STEP 2 OF 3</span>
                      <h3 className="text-lg font-black text-white uppercase">Architectural Metrics</h3>
                      <p className="text-xs text-gray-500">Provide approximate dimensions for the glass pane.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Preferred Technology</label>
                        <select
                          value={formData.productOfInterest}
                          onChange={(e) => setFormData({ ...formData, productOfInterest: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>Transparent LED Film (Adhesive)</option>
                          <option>Flexible LED Film (Curved Surfaces)</option>
                          <option>Structural Glass LED Display</option>
                          <option>Street-Facing Window LED Display</option>
                          <option>Architectural LED Curtain Mesh</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Pixel Pitch Preference</label>
                        <select
                          value={formData.pixelPitchPreference}
                          onChange={(e) => setFormData({ ...formData, pixelPitchPreference: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option value="3.91mm">3.91mm (High Definition, best close up)</option>
                          <option value="6.25mm">6.25mm (Excellent balance, standard)</option>
                          <option value="10.4mm">10.4mm (High transparency, cost-effective)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Estimated Glass Size (E.g. 10m x 3m)</label>
                        <input
                          type="text"
                          required
                          placeholder="10m x 3m (30 sq. meters)"
                          value={formData.glassSize}
                          onChange={(e) => setFormData({ ...formData, glassSize: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Project Location (City)</label>
                        <input
                          type="text"
                          required
                          placeholder="Gurugram, Mumbai, Bengaluru"
                          value={formData.projectLocation}
                          onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        />
                      </div>
                    </div>

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
                        className="bg-[#E30613] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center space-x-2"
                      >
                        <span>Financial Parameters</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: FINANCIAL PARAMETERS & SUBMIT */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest font-bold block mb-1">STEP 3 OF 3</span>
                      <h3 className="text-lg font-black text-white uppercase">Project Timeline & Budget</h3>
                      <p className="text-xs text-gray-500">Provide context to fine-tune the immediate calculations.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Expected Implementation Timeline</label>
                        <select
                          value={formData.timeline}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>Immediate (Within 30 Days)</option>
                          <option>Next 3 Months</option>
                          <option>Next 6 Months</option>
                          <option>Just consulting / planning</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Approximate Project Budget Allocated</label>
                        <select
                          value={formData.budgetRange}
                          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-lg py-2 pl-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                        >
                          <option>₹5L - ₹15L</option>
                          <option>₹15L - ₹25L</option>
                          <option>₹25L - ₹35L</option>
                          <option>₹35L - ₹50L</option>
                          <option>₹50L+ (Mega Facade)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Special instructions / Unique curves or shapes</label>
                      <textarea
                        placeholder="Please state if you require CAD drawings, wind stability structural certifications, or customized aluminum edge framing."
                        rows={4}
                        value={formData.specialRequirements}
                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-600"
                      />
                    </div>

                    <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-mono bg-white/[0.01] border border-white/5 p-3 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Certified calculation standard verified by Reefilm Technical Director Raj Gupta.</span>
                    </div>

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
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg flex items-center space-x-2"
                      >
                        <span>Calculate Estimate</span>
                        <ArrowRight className="w-4 h-4" />
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
