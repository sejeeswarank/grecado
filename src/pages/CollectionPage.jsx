import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronDown, ArrowUpRight } from "lucide-react";
import { products } from "../data/products";
import { categories } from "../data/categories";

const ITEMS_PER_PAGE = 12;

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const activeCategory = searchParams.get("category") || "all";

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

  const handleCategoryChange = (val) => {
    setSearchParams(val === "all" ? {} : { category: val });
    setPage(1);
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link to="/" className="text-xs text-zinc-500 hover:text-gold-400 transition-colors uppercase tracking-wider">
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mt-4">
            Our <span className="gold-gradient-text">Collection</span>
          </h1>
          <p className="text-zinc-400 mt-2">{filtered.length} products</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[180px]"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-gold-500/50 transition-colors min-w-[160px]"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No products found.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {paginated.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, duration: 0.4 } }}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-500/20 cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4 text-zinc-300" />
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400/70">{product.category.replace(/-/g, " ")}</span>
                  <h3 className="text-sm font-semibold text-zinc-200 mt-1 leading-snug">{product.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{product.color}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-semibold text-zinc-100">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
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

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] bg-zinc-800">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <span className="text-xs uppercase tracking-widest text-gold-400/70">
                {selectedProduct.category.replace(/-/g, " ")}
              </span>
              <h2 className="text-xl font-serif font-bold text-zinc-100 mt-1">{selectedProduct.name}</h2>
              <p className="text-sm text-zinc-400 mt-1">{selectedProduct.color}</p>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-2xl font-bold text-zinc-100">
                  ₹{selectedProduct.price.toLocaleString("en-IN")}
                </span>
              </div>
              <a
                href={`https://wa.me/917010200940?text=${encodeURIComponent(
                  `Hello Grecado! I am interested in purchasing the following item from your shop:\n\n• *Garment:* ${selectedProduct.name}\n• *Category:* ${selectedProduct.category}\n• *Color:* ${selectedProduct.color}\n• *Price:* ₹${selectedProduct.price.toLocaleString("en-IN")}\n• *Requested Size:* [size]\n\nPlease let me know if this is currently available in stock. Thank you!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full block text-center px-5 py-3 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-semibold tracking-widest uppercase rounded-lg hover:bg-gold-500/20 transition-all"
              >
                Inquire & Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
