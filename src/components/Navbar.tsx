import React, { useState, FormEvent } from "react";
import { Menu, X, Search, ChevronDown, Layers, FileText, Phone, Award, Shield } from "lucide-react";
import { WebsiteSettings } from "../types";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSearch: (query: string) => void;
  settings?: WebsiteSettings;
}

export default function Navbar({ currentTab, setCurrentTab, onSearch, settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const navItems = [
    { id: "home", label: settings?.navHome || "Home" },
    { id: "about", label: settings?.navAbout || "About Us" },
    { id: "products", label: settings?.navProducts || "Products" },
    { id: "applications", label: settings?.navApplications || "Applications" },
    { id: "projects", label: settings?.navProjects || "Projects" },
    { id: "gallery", label: settings?.navGallery || "Gallery" },
    { id: "resources", label: settings?.navResources || "Resources" },
    { id: "blog", label: settings?.navBlog || "Blog" },
    { id: "contact", label: settings?.navContact || "Contact" },
  ];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSearchOpen(false);
  };

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    setProductsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header id="nav-header" className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            id="logo-container"
            className="flex items-center space-x-2.5 cursor-pointer group font-display"
            onClick={() => handleNavClick("home")}
          >
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.companyName || "Reefilm India"} 
                className="h-9 w-auto object-contain rounded transition-transform group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="relative w-9 h-9 bg-gradient-to-tr from-red-600 to-neutral-900 rounded-lg flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(227,6,19,0.25)] transition-transform group-hover:scale-105">
                <span className="text-white font-extrabold text-lg tracking-tighter">R</span>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-600 rounded-full" />
              </div>
            )}
            <div>
              <div className="flex items-center">
                {settings?.companyName ? (
                  <span className="text-white font-extrabold text-lg tracking-tight uppercase">
                    {settings.companyName.split(" ")[0]}
                    {settings.companyName.split(" ").slice(1).length > 0 && (
                      <span className="text-[#E30613] ml-1">
                        {settings.companyName.split(" ").slice(1).join(" ")}
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    <span className="text-white font-extrabold text-lg tracking-tight">REEFILM</span>
                    <span className="text-[#E30613] font-extrabold text-lg ml-1">INDIA</span>
                  </>
                )}
              </div>
              <p className="text-[8px] text-neutral-400 tracking-widest uppercase font-mono font-bold leading-none">
                {settings?.tagline || "Transparent LED Film Solutions"}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.id === "products") {
                return (
                  <div 
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setProductsDropdownOpen(true)}
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                  >
                    <button
                      id="nav-btn-products"
                      onClick={() => handleNavClick("products")}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentTab === "products" 
                          ? "text-red-500 font-semibold" 
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      <span>Products</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Mega Menu Dropdown */}
                    {productsDropdownOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-0 w-[550px] bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-5 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-3 border-b border-white/5 pb-1 font-bold">Active Film Series</p>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Layers className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">O Series (Premium Facade)</p>
                                <p className="text-[10px] text-gray-500">High-Brightness Outdoor Weatherproof Film</p>
                              </div>
                            </button>
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Layers className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">I-F Series (Flexible Curve)</p>
                                <p className="text-[10px] text-gray-500">Ultra-Flexible & Customizable Film</p>
                              </div>
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-mono uppercase tracking-widest text-[#E30613] mb-3 border-b border-white/5 pb-1 font-bold">Bespoke Solutions</p>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Layers className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">I-R Series (Indoor Fine Pitch)</p>
                                <p className="text-[10px] text-gray-500">High-Density Corporate Glass Partition</p>
                              </div>
                            </button>
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Layers className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">Escalator & Handheld Series</p>
                                <p className="text-[10px] text-gray-500">Vibration-Resistant & Portable Demo Kits</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentTab === item.id 
                      ? "text-red-500 font-semibold" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              id="quote-cta-btn"
              onClick={() => handleNavClick("quote")}
              className="bg-[#E30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(227,6,19,0.2)] hover:shadow-[0_4px_25px_rgba(227,6,19,0.4)]"
            >
              {settings?.navQuote || "Request Quote"}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-white/5"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating search form overlay */}
      {searchOpen && (
        <div className="absolute top-20 left-0 w-full bg-black/95 border-b border-white/10 py-4 px-4 shadow-xl z-50 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                id="search-input"
                type="text"
                placeholder="Search products, technologies, case studies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm font-sans"
                autoFocus
              />
            </div>
            <button
              id="search-submit-btn"
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              Search
            </button>
            <button
              id="search-close-btn"
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-gray-400 hover:text-white p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-black/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mobile-nav-btn-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                currentTab === item.id 
                  ? "bg-red-600/10 text-red-500 font-bold border-l-4 border-red-600" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-white/5 flex flex-col space-y-3 px-4">
            <button
              id="mobile-quote-cta-btn"
              onClick={() => handleNavClick("quote")}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-center font-bold py-3 rounded-lg shadow-lg"
            >
              {settings?.navQuote || "Request Quote"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
