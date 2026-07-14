import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import ProductPage from "./pages/ProductPage";

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-400">
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        {children}
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
      </Routes>
    </Layout>
  );
}
