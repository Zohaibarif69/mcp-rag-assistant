import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeCtx {
  darkMode: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  darkMode: false,
  toggleDark: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark: () => setDarkMode((v) => !v) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
