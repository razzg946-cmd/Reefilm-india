import React, { useState, FormEvent } from "react";
import { Menu, X, Search, ChevronDown, Layers, FileText, Phone, Award, Shield } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSearch: (query: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab, onSearch }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "products", label: "Products" },
    { id: "applications", label: "Applications" },
    { id: "projects", label: "Projects" },
    { id: "gallery", label: "Gallery" },
    { id: "resources", label: "Resources" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
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
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="relative w-10 h-10 bg-gradient-to-tr from-red-600 to-black rounded-lg flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(227,6,19,0.3)] transition-transform group-hover:scale-105">
              <span className="text-white font-black text-xl tracking-tighter">R</span>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-white font-black text-lg tracking-wider">REEFILM</span>
                <span className="text-red-600 font-extrabold text-lg ml-1">INDIA</span>
              </div>
              <p className="text-[9px] text-gray-400 tracking-widest uppercase font-mono font-bold leading-none">Transparent LED Displays</p>
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
                          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-3 border-b border-white/5 pb-1 font-bold">LED Display Films</p>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Layers className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">Adhesive LED Film</p>
                                <p className="text-[10px] text-gray-500">Self-adhesive onto glass facades</p>
                              </div>
                            </button>
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Layers className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">Flexible LED Film</p>
                                <p className="text-[10px] text-gray-500">Perfect for curved pillars</p>
                              </div>
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-3 border-b border-white/5 pb-1 font-bold">Specialized Glass & Mesh</p>
                          <div className="space-y-2">
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Shield className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">Structural Glass Display</p>
                                <p className="text-[10px] text-gray-500">Pre-sandwiched double-glazed</p>
                              </div>
                            </button>
                            <button 
                              onClick={() => handleNavClick("products")} 
                              className="w-full text-left text-xs text-gray-300 hover:text-white hover:bg-white/5 p-2 rounded-md transition-all flex items-start space-x-2"
                            >
                              <Layers className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <p className="font-bold">Street Window LED</p>
                                <p className="text-[10px] text-gray-500">Extreme high brightness</p>
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
            {/* Search Toggle */}
            <button
              id="search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              id="quote-cta-btn"
              onClick={() => handleNavClick("quote")}
              className="bg-[#E30613] hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(227,6,19,0.3)] hover:shadow-[0_4px_25px_rgba(227,6,19,0.5)]"
            >
              Request Quote
            </button>

            {/* Quick Link to Admin panel */}
            <button
              id="admin-link-btn"
              onClick={() => handleNavClick("admin")}
              className="text-xs text-gray-500 hover:text-gray-300 font-mono border border-gray-800 rounded-md px-2 py-1 hover:bg-white/5 transition-all"
            >
              ADMIN
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"
            >
              <Search className="w-5 h-5" />
            </button>

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
              Request Quote
            </button>
            <button
              id="mobile-admin-link-btn"
              onClick={() => handleNavClick("admin")}
              className="w-full text-center text-xs text-gray-500 hover:text-gray-300 font-mono border border-gray-800 py-2 rounded-lg"
            >
              Access Admin Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
