import { Outlet, NavLink } from "react-router";
import { Home, Trophy, Code2, StickyNote, User, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeContext";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/contests", icon: Trophy, label: "Contests" },
  { to: "/practice", icon: Code2, label: "Practice" },
  { to: "/notes", icon: StickyNote, label: "Notes" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function AppLayout() {
  const { theme, toggleTheme, c } = useTheme();

  return (
    <div
      className="flex justify-center w-full min-h-screen transition-colors duration-500"
      style={{ background: c.bg, fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-[430px] min-h-screen relative flex flex-col">
        {/* Theme toggle - floating top right */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 flex justify-end px-5 pt-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl overflow-hidden"
            style={{
              background: c.surface,
              border: `1px solid ${c.border}`,
              boxShadow: theme === "light" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ y: -18, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 18, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25 }}
              >
                {theme === "dark" ? (
                  <Sun size={16} color="#F2CC60" />
                ) : (
                  <Moon size={16} color="#0969DA" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto pb-20">
          <Outlet />
        </div>
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 transition-colors duration-500"
          style={{
            background: c.navBg,
            backdropFilter: "blur(20px)",
            borderTop: `1px solid ${c.navBorder}`,
          }}
        >
          <div className="flex items-center justify-around py-2 px-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                    isActive ? "" : "opacity-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <tab.icon
                      size={20}
                      color={isActive ? c.primary : c.textSecondary}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        color: isActive ? c.primary : c.textSecondary,
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
