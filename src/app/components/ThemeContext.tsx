import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";

const darkColors = {
  bg: "#0D1117",
  surface: "#161B22",
  surfaceHover: "#1F2933",
  text: "#E6EDF3",
  textSecondary: "#8B949E",
  border: "rgba(255,255,255,0.05)",
  borderLight: "rgba(255,255,255,0.08)",
  primary: "#58A6FF",
  green: "#7EE787",
  yellow: "#F2CC60",
  red: "#F85149",
  orange: "#F78166",
  navBg: "rgba(22, 27, 34, 0.9)",
  navBorder: "rgba(88, 166, 255, 0.08)",
  heatEmpty: "#161B22",
  tooltipBg: "#1F2933",
  progressTrack: "rgba(255,255,255,0.06)",
};

const lightColors = {
  bg: "#F6F8FA",
  surface: "#FFFFFF",
  surfaceHover: "#EFF2F5",
  text: "#1F2328",
  textSecondary: "#656D76",
  border: "rgba(0,0,0,0.07)",
  borderLight: "rgba(0,0,0,0.1)",
  primary: "#0969DA",
  green: "#1A7F37",
  yellow: "#9A6700",
  red: "#CF222E",
  orange: "#BC4C00",
  navBg: "rgba(255, 255, 255, 0.92)",
  navBorder: "rgba(0, 0, 0, 0.06)",
  heatEmpty: "#EBEDF0",
  tooltipBg: "#FFFFFF",
  progressTrack: "rgba(0,0,0,0.06)",
};

export type ThemeColors = typeof darkColors;

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  c: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  c: darkColors,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem("cp-theme") as Theme) || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    localStorage.setItem("cp-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const c = theme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, c }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
