import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ isCollapsed }: { isCollapsed?: boolean }) {
  const location = useLocation();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 70 : 240 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 1,
        restDelta: 0.001
      }}
      className="border-r border-white/10 glass-panel h-screen flex flex-col shrink-0 overflow-hidden relative z-20"
    >
      <div className="p-4 flex flex-col h-full">
        <h2 className={clsx(
          "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 transition-all duration-200 mt-2",
          isCollapsed ? "opacity-0 invisible h-0 mb-0" : "opacity-100 px-2"
        )}>
          Menu
        </h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "relative flex items-center h-11 rounded-lg transition-all duration-300 group overflow-hidden",
                  isCollapsed ? "justify-center w-11 mx-auto" : "px-4 gap-3 w-full",
                  isActive 
                    ? "text-white bg-white/[0.03] shadow-sm" 
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {!isActive && (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                )}
                {isActive && (
                  <>
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)] rounded-r-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent pointer-events-none"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={clsx(
                  "w-5 h-5 z-10 transition-all duration-300 group-hover:scale-105 shrink-0",
                  isActive ? "text-[#D4AF37]" : "group-hover:text-white/90"
                )} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ 
                        duration: 0.2,
                        ease: [0.23, 1, 0.32, 1] 
                      }}
                      className={clsx("font-medium z-10 text-sm whitespace-nowrap", isActive ? "text-white font-semibold" : "")}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}
