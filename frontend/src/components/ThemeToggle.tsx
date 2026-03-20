import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setThemeState] = useState(
    localStorage.getItem("theme") || "light"
  );

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-gray-200/70 bg-white/80 text-surface-900 dark:text-gray-100 shadow-sm transition-all hover:scale-105 hover:bg-white dark:bg-gray-900 dark:border-slate-700/60 dark:bg-slate-900 dark:hover:bg-slate-800"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
