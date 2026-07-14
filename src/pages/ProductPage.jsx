import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Heart, Share2, ZoomIn, MessageCircle,
  CheckCircle2, Minus, Plus, ChevronRight,
} from "lucide-react";
import { products } from "../data/products";
import { categories } from "../data/categories";

const WHATSAPP_NUMBER = "917010200940";

export default function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors?.[0] ?? null);
      setSelectedSize(null);
      window.scrollTo(0, 0);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400 text-lg">Product not found.</p>
          <Link to="/collection" className="mt-4 inline-block text-gold-400 hover:underline">
            ← Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  const category = categories.find((c) => c.id === product.category);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const whatsappMessage = encodeURIComponent(
    `Hello GRECADO,\n\nI want to order this product.\n\n` +
    `*Product Name:* ${product.name}\n` +
    `*Category:* ${category?.name ?? product.category}\n` +
    `*Price:* ₹${product.price.toLocaleString("en-IN")}\n` +
    `*Selected Size:* ${selectedSize ?? "Not selected"}\n` +
    `*Selected Color:* ${selectedColor ?? "Not selected"}\n` +
    `*Quantity:* ${qty}\n\n` +
    `Please confirm availability.`
  );

  const colorDots = {
    "Chalk White": "#F5F5F0", "Off-White": "#F0EDE5", "Ivory": "#FFFFF0",
    "Alabaster White": "#F2F0EB", "Crisp White": "#FAFAFA", "Pristine White": "#FFFFFF",
    "Clean White": "#F8F8F8", "Midnight Black": "#0B0B0B", "Jet Black": "#111111",
    "Formal Black": "#1A1A1A", "Charcoal": "#36454F", "Dark Grey": "#404040",
    "Graphite Grey": "#4A4A4A", "Dove Grey": "#B5B8B1", "Heather Grey": "#9E9E9E",
    "Sky Blue": "#87CEEB", "Corporate Blue": "#2B5EA7", "Ice Blue": "#B0D4E8",
    "Light Blue": "#ADD8E6", "Pacific Blue": "#1D6FA4", "Indigo Blue": "#4B0082",
    "Deep Navy": "#1F305E", "Midnight Navy": "#191970", "Royal Navy": "#002366",
    "Imperial Navy": "#002147", "Forest Green": "#228B22", "Military Olive": "#4E5B31",
    "Earthy Olive": "#6B6B3A", "Sage": "#8FBC8F", "Cognac Brown": "#9A4422",
    "Espresso Brown": "#4A2C2A", "Chocolate Brown": "#3D1C02", "Hazel Brown": "#7B4F2E",
    "Tobacco Suede": "#8B6338", "Saddle Tan": "#C19A6B", "Sand Beige": "#C4A882",
    "Warm Beige": "#D4B896", "Desert Beige": "#C8A97E", "Oatmeal Beige": "#D9C5A0",
    "Champagne Gold": "#C9A34E", "Deep Maroon": "#800000", "Raw Indigo": "#3C2F6E",
    "Stone Wash Blue": "#5B7BA0", "Aged Indigo": "#3D4B6A", "Blush Peach": "#FFCBA4",
    "Blush Pink": "#FFB6C1",
  };

  const getDot = (color) => colorDots[color] ?? "#888888";

  return (
    <main className="min-h-screen bg-zinc-950 pt-20 pb-24">
      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-xs text-zinc-500">
          <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/collection?category=${product.category}`} className="hover:text-gold-400 transition-colors">
            {category?.name ?? product.category}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-zinc-300">{product.name}</span>
        </nav>
      </div>

      {/* ── Main Product Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Left: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main image */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 aspect-square group">
              {!imgLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl" />
              )}
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                } ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
                onClick={() => setZoomed((z) => !z)}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-950/80 backdrop-blur-sm text-gold-400 px-2.5 py-1 rounded border border-gold-400/20">
                  Premium Design
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-950/80 backdrop-blur-sm text-zinc-300 px-2.5 py-1 rounded">
                  {category?.name}
                </span>
              </div>

              {/* Zoom icon */}
              <div className="absolute bottom-4 right-4 w-9 h-9 bg-zinc-950/70 backdrop-blur-sm rounded-full flex items-center justify-center text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>

            {/* Related thumbnails */}
            {related.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                <button
                  className="aspect-square rounded-xl overflow-hidden border-2 border-gold-400"
                  onClick={() => {}}
                >
                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                </button>
                {related.slice(0, 3).map((r) => (
                  <button
                    key={r.id}
                    className="aspect-square rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors"
                    onClick={() => navigate(`/product/${r.id}`)}
                  >
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right: Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-gold-400 transition-colors mb-6 w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Collection
            </button>

            {/* Tag line */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500">Grecado</span>
              <span className="text-zinc-700">•</span>
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold-400/80">{selectedColor}</span>
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-100 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-zinc-100">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-zinc-500">Inclusive of all taxes</span>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* ── Color Selection ── */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">
                Color — <span className="text-zinc-300">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    title={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      selectedColor === color
                        ? "border-gold-400 scale-110 ring-2 ring-gold-400/30"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                    style={{ backgroundColor: getDot(color) }}
                  />
                ))}
              </div>
            </div>

            {/* ── Size Selection ── */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500">Select Size</p>
                {!selectedSize && (
                  <span className="text-[10px] text-amber-400/80">Please select a size</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded border text-sm font-semibold transition-all cursor-pointer ${
                      selectedSize === size
                        ? "bg-gold-400 border-gold-400 text-zinc-950"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Quantity ── */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xl font-bold text-zinc-100 w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Features ── */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-500 mb-3">Features</p>
              <ul className="space-y-2">
                {product.features?.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-sm tracking-wider rounded-xl transition-all shadow-lg shadow-green-900/30 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </a>
              <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
                Your order details (name, size, color, qty) are sent automatically to the store.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setWishlisted((w) => !w)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border transition-all cursor-pointer ${
                    wishlisted
                      ? "border-red-500/50 bg-red-500/10 text-red-400"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-400" : ""}`} />
                  {wishlisted ? "Wishlisted" : "Wishlist"}
                </button>
                <button
                  onClick={() => {
                    navigator.share?.({ title: product.name, url: window.location.href })
                      .catch(() => navigator.clipboard.writeText(window.location.href));
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Custom size */}
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <MessageCircle className="w-3 h-3 text-zinc-600" />
                <span className="text-xs text-zinc-600">
                  Need a custom size?{" "}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hello GRECADO! I need a custom size for: ${product.name}`
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
          </motion.div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-zinc-800/40 pt-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-[10px] tracking-[0.2em] text-gold-400/80 uppercase font-medium">More from</span>
                <h2 className="text-2xl font-serif font-bold mt-1">
                  {category?.name} <span className="gold-gradient-text">Collection</span>
                </h2>
              </div>
              <Link
                to={`/collection?category=${product.category}`}
                className="text-xs text-zinc-500 hover:text-gold-400 transition-colors tracking-wider uppercase"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((rel, i) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={`/product/${rel.id}`}
                    className="group block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-zinc-800">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-semibold text-zinc-200 leading-snug line-clamp-1">{rel.name}</h3>
                      <p className="text-sm font-bold text-zinc-100 mt-1">₹{rel.price.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Image Zoom Backdrop ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
