import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Clock, MapPin, Phone } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { CONTACT } from "../data/constants";

function StoreStatus() {
  const [timeStr, setTimeStr] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date();
      const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      const h = ist.getHours();
      const m = String(ist.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      setTimeStr(`${h12}:${m} ${ampm} IST`);
      setOpen(h >= CONTACT.openHour && h < CONTACT.closeHour);
    }
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-2 h-2 rounded-full ${open ? "bg-emerald-500" : "bg-red-500"} animate-pulse`} />
      <span className="text-zinc-400">{open ? "Open Now" : "Closed"} · {timeStr}</span>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { label: "Categories", action: () => scrollTo("categories") },
    { label: "Collection", to: "/collection" },
    { label: "Philosophy", action: () => scrollTo("about") },
    { label: "Gallery", action: () => scrollTo("gallery") },
    { label: "Location", action: () => scrollTo("location") },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <img src="/shop_logo/logo.svg" alt="Grecado" className="h-8 w-auto transition-transform group-hover:scale-105" />
              <span className="text-lg font-serif tracking-wider text-zinc-100 hidden sm:block">GRECADO</span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <StoreStatus />
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    className={`text-sm tracking-wider uppercase transition-colors hover:text-gold-400 ${
                      location.pathname === link.to ? "text-gold-400" : "text-zinc-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="text-sm tracking-wider uppercase text-zinc-400 transition-colors hover:text-gold-400 cursor-pointer"
                  >
                    {link.label}
                  </button>
                )
              )}
              <a
                href={`tel:${CONTACT.phone}`}
                className="text-sm text-zinc-300 hover:text-gold-400 transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                {CONTACT.phone}
              </a>
              <ThemeToggle />
              <Link
                to="/collection"
                className="px-4 py-2 text-xs font-semibold tracking-widest uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30 rounded hover:bg-gold-500/20 transition-all"
              >
                Explore Shop
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-zinc-950/98 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
            <StoreStatus />
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-2xl font-serif tracking-wider text-zinc-300 hover:text-gold-400 transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-2xl font-serif tracking-wider text-zinc-300 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  {link.label}
                </button>
              )
            )}
            <div className="flex items-center gap-3 text-zinc-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{CONTACT.hours}</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{CONTACT.addressShort}</span>
            </div>
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-2 text-lg text-gold-400 hover:text-gold-300 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Store
            </a>
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}
