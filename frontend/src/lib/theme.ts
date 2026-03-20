export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "trackmate-theme";

export const getPreferredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
};

export const setTheme = (theme: Theme) => {
  applyTheme(theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const initializeTheme = () => {
  applyTheme(getPreferredTheme());
};

export const toggleTheme = (theme: Theme): Theme => {
  const nextTheme: Theme = theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  return nextTheme;
};
