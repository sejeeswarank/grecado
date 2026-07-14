import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, RotateCcw, Heart, SlidersHorizontal, Grid, List, Sparkles } from "lucide-react";
import { products } from "../data/products";
import { categories } from "../data/categories";

const SIZES_FILTER = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "6", "7", "8", "9", "10", "11"];

const COLOR_METADATA = [
  { name: "White", value: "#FFFFFF" },
  { name: "Black", value: "#0B0B0B" },
  { name: "Blue", value: "#2B5EA7" },
  { name: "Navy", value: "#1F305E" },
  { name: "Grey", value: "#4A4A4A" },
  { name: "Olive", value: "#4E5B31" },
  { name: "Brown", value: "#7B4F2E" },
  { name: "Beige", value: "#D4B896" },
  { name: "Maroon", value: "#800000" },
  { name: "Green", value: "#228B22" }
];

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ─── Filter States ─────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [showWishlistedOnly, setShowWishlistedOnly] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("grecado_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ─── UI & Skeleton States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "all";

  // Handle wishlist toggle
  const toggleWishlist = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("grecado_wishlist", JSON.stringify(next));
      return next;
    });
  };

  // Simulate premium skeleton loading on filter/category changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, [activeCategory, search, sort, selectedSize, selectedColor, maxPrice, showWishlistedOnly]);

  // ─── Filtering & Sorting Logic ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...products];

    // Category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Size filter
    if (selectedSize) {
      result = result.filter((p) => p.sizes?.includes(selectedSize));
    }

    // Color filter
    if (selectedColor) {
      result = result.filter(
        (p) =>
          p.color.toLowerCase().includes(selectedColor.toLowerCase()) ||
          p.colors?.some((c) => c.toLowerCase().includes(selectedColor.toLowerCase()))
      );
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Wishlist only
    if (showWishlistedOnly) {
      result = result.filter((p) => wishlist.includes(p.id));
    }

    // Sorting
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      // simulate newest by ordering by id desc
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [activeCategory, search, selectedSize, selectedColor, maxPrice, showWishlistedOnly, wishlist, sort]);

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    categories.forEach((cat) => {
      counts[cat.id] = products.filter((p) => p.category === cat.id).length;
    });
    return counts;
  }, []);

  const handleCategoryChange = (val) => {
    setSearchParams(val === "all" ? {} : { category: val });
  };

  const handleResetFilters = () => {
    setSearch("");
    setSort("default");
    setSelectedSize("");
    setSelectedColor("");
    setMaxPrice(1500);
    setShowWishlistedOnly(false);
    setSearchParams({});
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#0B0B0B] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-400">
      {/* ─── Breadcrumbs & Header ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-gold-400 transition-colors uppercase tracking-[0.2em]"
          >
            ← Back to Home
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <span className="text-[10px] tracking-[0.35em] text-gold-400 uppercase font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Grecado Atelier Collection
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold mt-2 tracking-tight">
                Premium <span className="gold-gradient-text italic">Catalogue</span>
              </h1>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed font-sans font-light">
              Explore meticulously tailored menswear designed for comfort, luxury finish, and clean proportions.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─── Layout: Sidebar + Grid ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            {/* Search */}
            <div className="border-b border-zinc-900 pb-6">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input
                  type="text"
                  placeholder="Find garments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-gold-400/40 transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="border-b border-zinc-900 pb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">Categories</h3>
              </div>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-gold-500/10 text-gold-400 font-semibold"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                    }`}
                  >
                    <span>All Collections</span>
                    <span className="text-[10px] opacity-60 font-mono">{categoryCounts.all}</span>
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? "bg-gold-500/10 text-gold-400 font-semibold"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-60 font-mono">{categoryCounts[cat.id] || 0}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter by Price */}
            <div className="border-b border-zinc-900 pb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">Max Price</h3>
                <span className="text-xs text-gold-400 font-mono font-bold">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold-400 bg-zinc-900 h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-mono">
                <span>₹200</span>
                <span>₹1,500</span>
              </div>
            </div>

            {/* Filter by Size */}
            <div className="border-b border-zinc-900 pb-6">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">Filter by Size</h3>
              <div className="flex flex-wrap gap-1.5">
                {SIZES_FILTER.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                    className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider transition-all cursor-pointer border ${
                      selectedSize === size
                        ? "bg-gold-400 text-zinc-950 border-gold-400 shadow-md shadow-gold-500/10"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Color */}
            <div className="border-b border-zinc-900 pb-6">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-3">Filter by Color</h3>
              <div className="flex flex-wrap gap-2">
                {COLOR_METADATA.map((col) => (
                  <button
                    key={col.name}
                    title={col.name}
                    onClick={() => setSelectedColor(selectedColor === col.name ? "" : col.name)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center relative ${
                      selectedColor === col.name
                        ? "border-gold-400 ring-2 ring-gold-400/30 scale-110"
                        : "border-zinc-800 hover:border-zinc-600"
                    }`}
                    style={{ backgroundColor: col.value }}
                  >
                    {selectedColor === col.name && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishlisted only & Reset */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setShowWishlistedOnly((w) => !w)}
                className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  showWishlistedOnly
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showWishlistedOnly ? "fill-red-400" : ""}`} />
                {showWishlistedOnly ? "Show All Products" : "View Wishlist"}
              </button>

              <button
                onClick={handleResetFilters}
                className="w-full py-2.5 px-3 rounded-lg border border-dashed border-zinc-800 text-zinc-500 hover:text-gold-400 hover:border-zinc-700 text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* ── Toolbar & Main Grid Area ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter buttons */}
            <div className="lg:hidden flex items-center justify-between gap-3 mb-6 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-gold-400 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-gold-400" />
                Filters
              </button>
              <div className="flex gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Desktop Top Toolbar */}
            <div className="hidden lg:flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
              <p className="text-xs text-zinc-500 font-light">
                Showing <span className="text-zinc-200 font-medium">{filtered.length}</span> premium products
              </p>
              <div className="flex items-center gap-4">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Wishlist Header Indicator */}
            {showWishlistedOnly && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-between">
                <span className="text-xs text-red-400 font-semibold tracking-wide uppercase flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-red-400" /> Wishlist Filter Active
                </span>
                <button
                  onClick={() => setShowWishlistedOnly(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Show All
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col space-y-4">
                    <div className="aspect-[3/4] bg-zinc-900 rounded-2xl border border-zinc-800/40" />
                    <div className="h-4 bg-zinc-900 rounded w-2/3" />
                    <div className="h-4 bg-zinc-900 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-28 border border-zinc-900/60 rounded-2xl bg-zinc-900/10">
                <SlidersHorizontal className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500 font-light">No premium garments match your selected filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-gold-400 hover:border-zinc-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 gap-6"
              >
                {filtered.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);
                  return (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative flex flex-col bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
                        {/* Lazy-loaded category badge */}
                        <span className="absolute top-3 left-3 z-10 text-[9px] font-bold tracking-widest uppercase bg-zinc-950/80 backdrop-blur-sm text-gold-400 px-2 py-0.5 rounded border border-gold-400/20">
                          {categories.find((c) => c.id === product.category)?.name ?? product.category}
                        </span>

                        {/* Wishlist Heart */}
                        <button
                          onClick={(e) => toggleWishlist(e, product.id)}
                          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center text-zinc-500 hover:text-red-400 hover:scale-110 active:scale-95 transition-all"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                        </button>

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content Panel */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] font-semibold tracking-wider text-zinc-500 uppercase">{product.color}</p>
                          <h3 className="text-xs font-semibold text-zinc-100 leading-snug line-clamp-1 mt-1 group-hover:text-gold-400 transition-colors">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex items-baseline justify-between mt-3.5">
                          <span className="text-xs font-bold text-zinc-100">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-light hover:text-gold-400 transition-colors flex items-center gap-0.5">
                            Order ↗
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filters Slide-Over ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Content box */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xs bg-[#0B0B0B] border-r border-zinc-900 p-6 overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
                <span className="text-sm font-semibold tracking-wider uppercase text-zinc-100">Collection Filters</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-200"
                >
                  Close ✕
                </button>
              </div>

              {/* Mobile Search */}
              <div className="border-b border-zinc-900 pb-5 mb-5">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2.5">Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Find garments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 placeholder-zinc-700"
                  />
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="border-b border-zinc-900 pb-5 mb-5">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2.5">Categories</h4>
                <select
                  value={activeCategory}
                  onChange={(e) => {
                    handleCategoryChange(e.target.value);
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full pl-3 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300"
                >
                  <option value="all">All Collections</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Sizes */}
              <div className="border-b border-zinc-900 pb-5 mb-5">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2.5">Sizes</h4>
                <div className="flex flex-wrap gap-1.5">
                  {SIZES_FILTER.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? "" : size)}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-mono font-semibold tracking-wider transition-all cursor-pointer border ${
                        selectedSize === size
                          ? "bg-gold-400 text-zinc-950 border-gold-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Colors */}
              <div className="border-b border-zinc-900 pb-5 mb-5">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 mb-2.5">Colors</h4>
                <div className="flex flex-wrap gap-2">
                  {COLOR_METADATA.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(selectedColor === col.name ? "" : col.name)}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                        selectedColor === col.name
                          ? "border-gold-400 ring-2 ring-gold-400/30 scale-110"
                          : "border-zinc-800"
                      }`}
                      style={{ backgroundColor: col.value }}
                    >
                      {selectedColor === col.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Max Price */}
              <div className="border-b border-zinc-900 pb-5 mb-5">
                <div className="flex justify-between items-center mb-2.5">
                  <h4 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Max Price</h4>
                  <span className="text-xs text-gold-400 font-mono font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-gold-400 bg-zinc-900 h-1 rounded-lg cursor-pointer"
                />
              </div>

              {/* Mobile buttons */}
              <div className="mt-auto space-y-2 pt-4">
                <button
                  onClick={() => setShowWishlistedOnly((w) => !w)}
                  className={`w-full py-2.5 px-3 rounded-lg border text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 ${
                    showWishlistedOnly
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "border-zinc-800 text-zinc-400"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${showWishlistedOnly ? "fill-red-400" : ""}`} />
                  {showWishlistedOnly ? "Show All Products" : "View Wishlist"}
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-lg border border-dashed border-zinc-800 text-zinc-500 text-xs font-semibold tracking-wider transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
