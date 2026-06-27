import { useState } from "react";
import { INITIAL_RESOURCES, FAQS } from "../data";
import { Download, HelpCircle, FileText, ChevronDown, ChevronUp, CheckCircle, Search } from "lucide-react";

export default function ResourcesView() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");

  const handleDownload = (id: string, title: string) => {
    alert(`Thank you! Downloading package: "${title}" in PDF format. This resource is supplied by Reefilm India Technical Desk.`);
  };

  const filteredFaqs = faqSearchQuery.trim() === ""
    ? FAQS
    : FAQS.filter(f => 
        f.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
        f.answer.toLowerCase().includes(faqSearchQuery.toLowerCase())
      );

  return (
    <div id="resources-page" className="bg-black text-white font-sans min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">RESOURCE REPOSITORY</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Download & FAQ Center</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Access complete product dimensions, CE/RoHS safety reports, lamination blueprints, and comprehensive support answers managed by Raj Gupta's engineering team.
          </p>
        </div>
      </section>

      {/* Download Cards Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-white/10 pb-8 mb-12">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">Technical Document Library</h2>
            <p className="text-xs text-gray-500">Official, certified materials compiled directly by Reefilm Technical Support Desk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_RESOURCES.map((doc) => (
              <div key={doc.id} className="border border-white/5 bg-white/[0.01] p-6 rounded-xl flex flex-col justify-between hover:border-white/15 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-[10px] font-mono text-red-500 bg-red-600/15 border border-red-500/20 px-2 py-0.5 rounded uppercase font-bold">
                      {doc.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">{doc.title}</h3>
                    <p className="text-[11px] text-gray-500 mt-1 font-mono">Format: Certified PDF • Size: {doc.fileSize}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-mono">{doc.downloadCount} Downloads</span>
                  <button
                    onClick={() => handleDownload(doc.id, doc.title)}
                    className="bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-red-500" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-neutral-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-bold">SUPPORT DESK</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">Frequently Asked Questions</h2>
            
            {/* Search FAQ */}
            <div className="relative mt-6 max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search FAQs (e.g. transparency, warranty, installation)..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div key={idx} className="border border-white/5 bg-black rounded-xl overflow-hidden transition-all">
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between text-sm font-bold text-white hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <HelpCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <span>{faq.question}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-red-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-5 border-t border-white/5 bg-neutral-950 text-xs text-gray-400 leading-relaxed space-y-2">
                      <p>{faq.answer}</p>
                      <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 font-mono pt-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Category: {faq.category} • Verified by Reefilm Support</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredFaqs.length === 0 && (
              <p className="text-center text-xs text-gray-500 py-8 font-mono">No relevant FAQs found matching your query. Contact us below for direct assistance.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
