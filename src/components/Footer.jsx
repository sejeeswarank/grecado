import { Link, useLocation, useNavigate } from "react-router-dom";
import { CONTACT } from "../data/constants";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <img src="/shop_logo/logo.svg" alt="Grecado" className="h-10 w-auto mb-4" />
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Curated menswear and tailoring house in RM Colony, Dindigul, Tamil Nadu. Designed for luxury, tailored to stay.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => scrollTo("categories")} className="text-sm text-zinc-500 hover:text-gold-400 transition-colors cursor-pointer">Categories</button></li>
              <li><Link to="/collection" className="text-sm text-zinc-500 hover:text-gold-400 transition-colors">Collection</Link></li>
              <li><button onClick={() => scrollTo("gallery")} className="text-sm text-zinc-500 hover:text-gold-400 transition-colors cursor-pointer">Gallery</button></li>
              <li><button onClick={() => scrollTo("location")} className="text-sm text-zinc-500 hover:text-gold-400 transition-colors cursor-pointer">Find Store</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-zinc-500">
              <li>{CONTACT.address}</li>
              <li><a href={`tel:${CONTACT.phone}`} className="hover:text-gold-400 transition-colors">{CONTACT.phone}</a></li>
              <li>{CONTACT.hours}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800/30 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">&copy; 2026 Grecado. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
