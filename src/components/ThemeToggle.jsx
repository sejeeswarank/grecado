import { useState, useEffect, useCallback } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-zinc-800 border border-zinc-700 cursor-pointer transition-colors hover:border-zinc-500 flex-shrink-0"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-zinc-100 shadow-md transition-transform duration-300 flex items-center justify-center text-xs ${
          dark ? "translate-x-0.5" : "translate-x-7.5"
        }`}
      >
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
