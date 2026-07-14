import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, X, MessageCircle, RotateCcw } from "lucide-react";
import { products } from "../data/products";
import { categories } from "../data/categories";

// ─── Per-category sizes ───────────────────────────────────────────────────────
const SIZES = {
  shirts: ["S", "M", "L", "XL", "XXL"],
  pants: ["28", "30", "32", "34", "36", "38"],
  "coat-suits": ["36", "38", "40", "42", "44"],
  shoes: ["6", "7", "8", "9", "10", "11"],
};

// ─── Per-category garment specs ───────────────────────────────────────────────
const CATEGORY_SPECS = {
  shirts: [
    "100% Long-Staple Brushed Cotton",
    "Medium-weight thermal weave (180 GSM)",
    "Dual chest button-flap pockets",
    "Reinforced flat-felled seams",
    "Pre-shrunk to maintain fit",
  ],
  pants: [
    "Premium stretch cotton blend",
    "Tapered slim-fit silhouette",
    "Reinforced double-stitched seams",
    "YKK zipper with button closure",
    "Deep front and back pockets",
  ],
  "coat-suits": [
    "Pure wool composition",
    "Full canvas construction",
    "Surgeon's cuffs with working buttonholes",
    "Hand-padded lapels",
    "Fully lined with bemberg lining",
  ],
  shoes: [
    "Genuine full-grain leather upper",
    "Goodyear welted construction",
    "Leather insole with cushioning",
    "Rubber outsole for durability",
    "Hand-stitched detailing",
  ],
};

// ─── Per-category descriptions ────────────────────────────────────────────────
const CATEGORY_DESCRIPTIONS = {
  shirts:
    "Crafted from premium long-staple cotton, this shirt offers exceptional softness and a refined finish. Designed for the modern gentleman who values both style and everyday comfort.",
  pants:
    "Premium quality trousers built for both style and durability. Tailored for a clean, modern silhouette that transitions seamlessly from casual to formal occasions.",
  "coat-suits":
    "A masterpiece of tailoring excellence. Constructed with full canvas for superior drape and longevity — every stitch reflects our commitment to sartorial craftsmanship.",
  shoes:
    "Handcrafted with genuine full-grain leather and precision finishing. Built to last a lifetime while maintaining elegant style through every occasion.",
};

const ITEMS_PER_PAGE = 12;

function getCategoryLabel(id) {
  const cat = categories.find((c) => c.id === id);
  return cat ? cat.name : id.replace(/-/g, " ").toUpperCase();
}

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const activeCategory = searchParams.get("category") || "all";

  // ─── Filtering + sorting ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [activeCategory, search, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    categories.forEach((cat) => {
      counts[cat.id] = products.filter((p) => p.category === cat.id).length;
    });
    return counts;
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleCategoryChange = (val) => {
    setSearchParams(val === "all" ? {} : { category: val });
    setPage(1);
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
  };

  // ─── Modal derived values ────────────────────────────────────────────────────
  const sizes = selectedProduct
    ? SIZES[selectedProduct.category] || ["S", "M", "L", "XL", "XXL"]
    : [];
  const specs = selectedProduct
    ? CATEGORY_SPECS[selectedProduct.category] || []
    : [];
  const description = selectedProduct
    ? CATEGORY_DESCRIPTIONS[selectedProduct.category] || ""
    : "";
  const whatsappText = selectedProduct
    ? encodeURIComponent(
        `Hello Grecado! I am interested in purchasing the following item:\n\n` +
          `• *Garment:* ${selectedProduct.name}\n` +
          `• *Category:* ${getCategoryLabel(selectedProduct.category)}\n` +
          `• *Color:* ${selectedProduct.color}\n` +
          `• *Price:* ₹${selectedProduct.price.toLocaleString("en-IN")}\n` +
          `• *Requested Size:* ${selectedSize || "[Please specify size]"}\n\n` +
          `Please let me know if this is currently available in stock. Thank you!`
      )
    : "";

  return (
    <main className="min-h-screen pt-24 pb-20 bg-zinc-950 text-zinc-100">
      {/* ─── Page Header ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-gold-400 transition-colors uppercase tracking-widest"
          >
            ← Back to Home
          </Link>
          <div className="mt-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl sm:text-6xl font-serif font-bold leading-[1.1]">
                The Grecado
                <br />
                <span className="italic gold-gradient-text">Catalogue</span>
              </h1>
            </div>
            <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
              Browse our complete collection of uncompromising garments.
              Woven from premium fibres and custom tailored for your absolute
              comfort.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─── Body: Sidebar + Grid ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-10">
          {/* ── Sidebar (desktop) ──────────────────────────────────────────── */}
          <aside className="hidden lg:block w-48 flex-shrink-0">
            {/* Search */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600 mb-2.5">
                Search
              </p>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-7 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-600">
                  Categories
                </p>
                {activeCategory !== "all" && (
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className="text-[10px] text-zinc-500 hover:text-gold-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                )}
              </div>

              <ul className="space-y-0.5">
                {/* ALL */}
                <li>
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                      activeCategory === "all"
                        ? "bg-gold-400/10 text-zinc-100 border-l-2 border-gold-400 pl-2.5"
                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    <span>All</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                        activeCategory === "all"
                          ? "bg-gold-400/20 text-gold-400"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {categoryCounts.all}
                    </span>
                  </button>
                </li>

                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                        activeCategory === cat.id
                          ? "bg-gold-400/10 text-zinc-100 border-l-2 border-gold-400 pl-2.5"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-normal ${
                          activeCategory === cat.id
                            ? "bg-gold-400/20 text-gold-400"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {categoryCounts[cat.id] || 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ── Main content ────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filters */}
            <div className="lg:hidden flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={activeCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-gold-500/50 transition-colors"
                >
                  <option value="all">All</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Toolbar: count + sort */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-zinc-500">
                Showing{" "}
                <span className="text-zinc-200 font-medium">
                  {paginated.length}
                </span>{" "}
                of{" "}
                <span className="text-zinc-200 font-medium">
                  {filtered.length}
                </span>{" "}
                <span className="text-gold-400/70">garments</span>
              </p>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Product Grid */}
            {paginated.length === 0 ? (
              <div className="text-center py-24 text-zinc-600">
                No products found.
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                key={activeCategory + search + sort + page}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.05 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {paginated.map((product) => {
                  const cardSizes =
                    SIZES[product.category] || ["S", "M", "L", "XL", "XXL"];
                  return (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 18 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                      }}
                      className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer"
                      onClick={() => openProduct(product)}
                    >
                      {/* Image + category badge */}
                      <div className="relative">
                        <span className="absolute top-3 left-3 z-10 text-[9px] font-bold tracking-wider uppercase bg-zinc-950/75 backdrop-blur-sm text-zinc-300 px-2 py-1 rounded">
                          {getCategoryLabel(product.category)}
                        </span>
                        <div className="aspect-[4/3] overflow-hidden bg-zinc-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        {/* Name + price */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
                            {product.name}
                          </h3>
                          <span className="text-sm font-bold text-zinc-100 whitespace-nowrap">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Color dot */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-2 h-2 rounded-full bg-gold-400/60 flex-shrink-0" />
                          <span className="text-xs text-zinc-500">
                            {product.color}
                          </span>
                        </div>

                        {/* Sizes + Inquire row */}
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[10px] text-zinc-600">
                            <span className="mr-1.5">Sizes:</span>
                            {cardSizes.join("  ")}
                          </p>
                          <span className="text-[10px] font-medium text-green-400 flex items-center gap-1">
                            Inquire ↗
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-14">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      page === i + 1
                        ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Product Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeProduct}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25 }}
              className="bg-zinc-900 rounded-2xl w-full max-w-2xl overflow-hidden flex max-h-[90vh] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image */}
              <div className="relative w-[44%] flex-shrink-0 bg-zinc-800">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                {/* Category badge – bottom left of image */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-[9px] font-bold tracking-wider uppercase bg-zinc-950/90 text-zinc-300 px-2.5 py-1 rounded">
                    {getCategoryLabel(selectedProduct.category)}
                  </span>
                </div>
              </div>

              {/* Right: Detail panel */}
              <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Close button */}
                <div className="flex justify-end p-4 pb-0">
                  <button
                    onClick={closeProduct}
                    className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-100 hover:border-zinc-500 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 pb-6 flex flex-col gap-4">
                  {/* Tag row */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-zinc-500">
                      Premium Design
                    </span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-gold-400/80">
                      {selectedProduct.color}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-serif font-bold text-zinc-100 leading-snug">
                    {selectedProduct.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-zinc-100">
                      ₹{selectedProduct.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-zinc-600">
                      Inclusive of all taxes
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {description}
                  </p>

                  {/* Size selector */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-500 mb-2">
                      Select Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3.5 py-1.5 rounded border text-xs font-semibold transition-all cursor-pointer ${
                            selectedSize === size
                              ? "bg-zinc-100 border-zinc-100 text-zinc-900"
                              : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Garment specs */}
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-500 mb-2">
                      Garment Specifications
                    </p>
                    <ul className="space-y-1.5">
                      {specs.map((spec, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-zinc-400"
                        >
                          <span className="text-green-400 mt-0.5 flex-shrink-0 font-bold">
                            ✓
                          </span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* WhatsApp CTA */}
                  <div>
                    <a
                      href={`https://wa.me/917010200940?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white text-sm font-bold tracking-wide rounded-xl transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Inquire &amp; Chat on WhatsApp
                    </a>
                    <p className="text-[10px] text-zinc-600 text-center mt-2 leading-relaxed">
                      Sending product photo link, selected size, and price
                      automatically to store owner
                    </p>
                  </div>

                  {/* Custom size */}
                  <div className="flex items-center justify-center gap-1.5 pb-1">
                    <MessageCircle className="w-3 h-3 text-zinc-600" />
                    <span className="text-xs text-zinc-600">
                      Need a custom size?{" "}
                      <a
                        href={`https://wa.me/917010200940?text=${encodeURIComponent(
                          `Hello Grecado! I need a custom size for: ${selectedProduct.name} (${selectedProduct.color})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-2"
                      >
                        Chat with us
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
