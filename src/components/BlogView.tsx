import { useState } from "react";
import { INITIAL_BLOG_POSTS } from "../data";
import { BlogPost } from "../types";
import { Calendar, User, Clock, Search, ArrowRight, X } from "lucide-react";

export default function BlogView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);

  const categories = ["All", "Buying Guide", "Retail Display", "Installation Tips"];

  const filteredPosts = INITIAL_BLOG_POSTS.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="blog-page" className="bg-black text-white font-sans min-h-screen">
      {/* Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 font-bold">KNOWLEDGE CENTRE</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Technology Insights & Trends</h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Deep technical dives into lamination procedures, structural wind-loads, pixel pitch calibration, and global commercial retail trends.
          </p>

          {/* Search bar & Categories */}
          <div className="mt-10 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles, engineering tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-1 overflow-x-auto py-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setReadingPost(post)}
                className="group border border-white/5 bg-neutral-950 rounded-2xl overflow-hidden hover:border-white/15 transition-all flex flex-col justify-between cursor-pointer shadow-lg"
              >
                <div>
                  {/* Image Header */}
                  <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono uppercase text-red-500 font-bold">
                      {post.category}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-3.5">
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-black text-base text-white group-hover:text-red-500 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer read action */}
                <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-gray-500">
                    <User className="w-3.5 h-3.5 text-red-500" />
                    By {post.author}
                  </span>
                  <span className="text-red-500 group-hover:text-white transition-colors flex items-center gap-1 font-bold">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}

            {filteredPosts.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 font-mono">
                No matching articles found. Clear your search or filter to view all guides.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reader Modal View */}
      {readingPost && (
        <div className="fixed inset-0 z-50 bg-black/95 flex justify-center overflow-y-auto p-4 md:p-10">
          <div className="max-w-3xl w-full bg-neutral-950 border border-white/10 rounded-2xl my-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setReadingPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 bg-black/40 rounded-full border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner info */}
            <div>
              <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold block mb-2">{readingPost.category} • Certified Insight</span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-snug text-white">{readingPost.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-4 border-y border-white/5 py-3">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-red-500" />
                  Written by {readingPost.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {readingPost.publishedAt}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {readingPost.readTime}
                </span>
              </div>
            </div>

            {/* Simulated post content styled beautifully with markdown representation */}
            <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-wrap space-y-4 font-sans">
              {readingPost.content}
            </div>

            {/* Tags footer */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {readingPost.tags.map((tag) => (
                  <span key={tag} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-[10px] font-mono text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setReadingPost(null)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
