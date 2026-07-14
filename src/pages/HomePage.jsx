import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Phone } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { categories } from "../data/categories";
import { products } from "../data/products";
import { CONTACT } from "../data/constants";

const shopImageFiles = [
  "WhatsApp%20Image%202026-07-09%20at%2010.43.48%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.49%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.50%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.51%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.52%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.53%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.54%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.55%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.56%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.57%20AM.jpeg",
  "WhatsApp%20Image%202026-07-09%20at%2010.43.58%20AM.jpeg",
];

const shopImages = shopImageFiles.map((f) => `/shop_image/${f}`);

function Hero() {
  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setBgIdx((p) => (p + 1) % shopImages.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {shopImages.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === bgIdx ? "opacity-40" : "opacity-0"}`}
          style={{ backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/50 to-zinc-950" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <span className="text-xs tracking-[0.2em] text-gold-400/80 uppercase font-medium">GRECADO | UNCOMPROMISING TAILORING & FIT</span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold mt-6 leading-tight">
              Best Clothing Shop <br />
              <span className="gold-gradient-text">in Dindigul</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 mt-6 max-w-xl leading-relaxed">
              Dindigul&apos;s premier destination for custom-fit and ready-to-wear menswear. From premium checks & stripes
              and selvedge denim to tailored formal trousers, corporate office wear, and luxurious mulberry silk
              shirts&mdash;we bring together the finest fabrics and modern tailoring to elevate your everyday style.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/collection"
                className="group px-6 py-3.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-semibold tracking-widest uppercase rounded hover:bg-gold-500/20 transition-all flex items-center gap-2"
              >
                Explore Categories
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`https://maps.google.com/maps?q=Grecado,%20RM%20Colony,%20Dindigul,%20Tamil%20Nadu`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 border border-zinc-700 text-zinc-300 text-sm font-semibold tracking-widest uppercase rounded hover:bg-zinc-800/50 transition-all"
              >
                Visit Our Store
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gold-500/20 to-transparent rounded-2xl" />
              <img
                src="/products/luxury_wear_1.png"
                alt="Premium Menswear"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 glassmorphism rounded-xl p-4">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Featured Piece</p>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mt-1">
                  Champagne Silk Evening Shirt &mdash; ₹3,499
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const itemAnim = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function Categories() {
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : [];

  const handleCategoryClick = (catId) => {
    setActiveCategory((prev) => (prev === catId ? null : catId));
  };

  return (
    <section id="categories" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] text-gold-400/80 uppercase font-medium">Interactive Grid</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mt-3">
            Shop By <span className="gold-gradient-text">Category</span>
          </h2>
        </motion.div>

        {/* Category Cards – 4 columns */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.div key={cat.id} variants={itemAnim}>
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group w-full relative overflow-hidden rounded-xl border transition-all h-64 cursor-pointer ${
                    isActive
                      ? "border-gold-400 ring-2 ring-gold-400/40"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      isActive ? "opacity-80" : "opacity-60 group-hover:opacity-80"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  {isActive && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold-400 flex items-center justify-center">
                      <span className="text-zinc-950 text-xs font-bold">✓</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                    <h3 className={`text-sm font-semibold tracking-wider ${
                      isActive ? "text-gold-400" : "text-zinc-100"
                    }`}>{cat.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{cat.description}</p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Inline Product Grid */}
        {activeCategory && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-200 font-medium">{filteredProducts.length}</span> products in{" "}
                <span className="text-gold-400">{categories.find(c => c.id === activeCategory)?.name}</span>
              </p>
              <Link
                to={`/collection?category=${activeCategory}`}
                className="text-xs text-gold-400 hover:text-gold-300 tracking-wider uppercase transition-colors"
              >
                View All →
              </Link>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                No products available in this category.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.slice(0, 10).map((product) => (
                  <Link
                    key={product.id}
                    to={`/collection?category=${activeCategory}`}
                    className="group block bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-semibold text-zinc-200 leading-snug line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-zinc-500 mt-1">{product.color}</p>
                      <p className="text-sm font-semibold text-zinc-100 mt-1.5">₹{product.price.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 relative border-t border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-xs tracking-[0.2em] text-gold-400/80 uppercase font-medium">Philosophy</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mt-3 mb-8">
            Clothing That Speaks of <span className="gold-gradient-text">Silent Luxury</span>
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Crafted with precise structural integrity, every piece at Grecado is a testament to enduring style. We
            believe in fashion that transcends seasons&mdash;where heritage craftsmanship meets contemporary silhouettes.
            From the rugged charm of selvedge denim to the ethereal drape of mulberry silk, our collection is
            meticulously curated for the discerning gentleman who values substance over spectacle.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const galleryImages = shopImageFiles.slice(0, 8).map((f) => `/shop_image/${f}`);

function Gallery() {
  const [slideIdx, setSlideIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(null);

  const minSwipeDistance = 50;

  // Unified drag/swipe tracking using refs (works for both mouse and touch)
  const dragStartX = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);

  const handleDragStart = (clientX) => {
    dragStartX.current = clientX;
    isDragging.current = true;
    hasDragged.current = false;
  };

  const handleDragEnd = (clientX) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const distance = dragStartX.current - clientX;
    if (Math.abs(distance) > minSwipeDistance) {
      hasDragged.current = true;
      if (distance > 0) {
        setSlideIdx((p) => (p + 1) % galleryImages.length);
      } else {
        setSlideIdx((p) => (p === 0 ? galleryImages.length - 1 : p - 1));
      }
    }
    isDragging.current = false;
    dragStartX.current = null;
  };

  // Mouse events (desktop drag)
  const onMouseDown = (e) => handleDragStart(e.clientX);
  const onMouseUp = (e) => handleDragEnd(e.clientX);

  // Touch events (mobile swipe)
  const onTouchStart = (e) => handleDragStart(e.targetTouches[0].clientX);
  const onTouchEnd = (e) => handleDragEnd(e.changedTouches[0].clientX);

  // Fullscreen drag/swipe support
  const fsDragStartX = useRef(null);
  const fsIsDragging = useRef(false);
  const fsHasDragged = useRef(false);

  const fsDragStart = (clientX) => {
    fsDragStartX.current = clientX;
    fsIsDragging.current = true;
    fsHasDragged.current = false;
  };

  const fsDragEnd = (clientX, e) => {
    if (!fsIsDragging.current || fsDragStartX.current === null) return;
    const distance = fsDragStartX.current - clientX;
    if (Math.abs(distance) > minSwipeDistance) {
      fsHasDragged.current = true;
      e.stopPropagation();
      if (distance > 0) {
        setFullscreen((p) => (p + 1) % galleryImages.length);
      } else {
        setFullscreen((p) => (p === 0 ? galleryImages.length - 1 : p - 1));
      }
    }
    fsIsDragging.current = false;
    fsDragStartX.current = null;
  };

  const onFsMouseDown = (e) => fsDragStart(e.clientX);
  const onFsMouseUp = (e) => fsDragEnd(e.clientX, e);
  const onFsTouchStart = (e) => fsDragStart(e.targetTouches[0].clientX);
  const onFsTouchEnd = (e) => fsDragEnd(e.changedTouches[0].clientX, e);

  useEffect(() => {
    if (fullscreen === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setFullscreen(null);
      if (e.key === "ArrowLeft") setFullscreen((p) => (p === 0 ? galleryImages.length - 1 : p - 1));
      if (e.key === "ArrowRight") setFullscreen((p) => (p + 1) % galleryImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  return (
    <section id="gallery" className="py-24 relative border-t border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] text-gold-400/80 uppercase font-medium">Moments</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mt-3">
            Photo <span className="gold-gradient-text">Gallery</span>
          </h2>
        </motion.div>
        <div 
          className="relative overflow-hidden rounded-2xl bg-zinc-900 group/gallery select-none cursor-grab active:cursor-grabbing"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="relative h-[400px] sm:h-[500px]">
            {galleryImages.map((url, i) => (
              <div
                key={url}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === slideIdx ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => {
                  if (!hasDragged.current) setFullscreen(i);
                }}
              >
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows for Gallery Slider */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSlideIdx((p) => (p === 0 ? galleryImages.length - 1 : p - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-950/60 hover:bg-zinc-950/90 text-zinc-300 hover:text-white transition-all border border-zinc-800 hover:border-zinc-700 cursor-pointer opacity-100 lg:opacity-0 lg:group-hover/gallery:opacity-100"
            aria-label="Previous image"
          >
            <span className="text-2xl leading-none -translate-x-[1px]">‹</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSlideIdx((p) => (p + 1) % galleryImages.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-zinc-950/60 hover:bg-zinc-950/90 text-zinc-300 hover:text-white transition-all border border-zinc-800 hover:border-zinc-700 cursor-pointer opacity-100 lg:opacity-0 lg:group-hover/gallery:opacity-100"
            aria-label="Next image"
          >
            <span className="text-2xl leading-none translate-x-[1px]">›</span>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setSlideIdx(i);
                }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  i === slideIdx ? "bg-gold-400 w-6" : "bg-zinc-500/50 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      {fullscreen !== null && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          onClick={() => { if (!fsHasDragged.current) setFullscreen(null); }}
          onMouseDown={onFsMouseDown}
          onMouseUp={onFsMouseUp}
          onTouchStart={onFsTouchStart}
          onTouchEnd={onFsTouchEnd}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen((p) => (p === 0 ? galleryImages.length - 1 : p - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors"
          >
            ‹
          </button>
          <img
            src={galleryImages[fullscreen]}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen((p) => (p + 1) % galleryImages.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors"
          >
            ›
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreen(null);
            }}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10 cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}

const isStoreOpen = () => {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const h = ist.getHours();
  return h >= CONTACT.openHour && h < CONTACT.closeHour;
};

function Location() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(isStoreOpen());
    const id = setInterval(() => setOpen(isStoreOpen()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="location" className={`py-24 relative ${open ? "" : "border-t border-zinc-800/30"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] text-gold-400/80 uppercase font-medium">Visit Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mt-3">
            Location & <span className="gold-gradient-text">Hours</span>
          </h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-gold-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold tracking-wider uppercase text-zinc-300">Address</h4>
                <p className="text-zinc-400 mt-1">{CONTACT.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-gold-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold tracking-wider uppercase text-zinc-300">Business Hours</h4>
                <p className="text-zinc-400 mt-1">{CONTACT.hours}</p>
                <span className={`inline-flex items-center gap-1.5 mt-2 text-xs ${open ? "text-emerald-400" : "text-red-400"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-emerald-400" : "bg-red-400"}`} />
                  {open ? "Open now" : "Closed now"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-gold-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold tracking-wider uppercase text-zinc-300">Phone</h4>
                <a href={`tel:${CONTACT.phone}`} className="text-zinc-400 hover:text-gold-400 transition-colors mt-1 block">
                  {CONTACT.phone}
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-semibold tracking-widest uppercase rounded hover:bg-gold-500/20 transition-all"
              >
                Get Directions
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-zinc-700 text-zinc-300 text-sm font-semibold tracking-widest uppercase rounded hover:bg-zinc-800/50 transition-all"
              >
                Chat with Owner
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-zinc-800 h-[350px]"
          >
            <iframe
              title="Grecado Location"
              src={CONTACT.mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <About />
      <Gallery />
      <Location />
    </main>
  );
}
