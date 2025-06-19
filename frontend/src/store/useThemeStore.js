import { create } from "zustand";

const getInitialTheme = () => localStorage.getItem("theme") || "light"; // or your default

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
