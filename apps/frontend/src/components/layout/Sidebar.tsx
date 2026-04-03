import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';
import { Link, useLocation } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },

  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-white/10 glass-panel h-screen flex flex-col shrink-0">
      <div className="p-6">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
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
                  "relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 group overflow-hidden",
                  isActive 
                    ? "text-white bg-white/[0.03] shadow-sm" 
                    : "text-muted-foreground hover:text-white hover:bg-white/[0.02]"
                )}
              >
                {isActive && (
                  <>
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 to-transparent"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </>
                )}
                <Icon className={clsx("w-5 h-5 z-10 transition-colors duration-300", isActive ? "text-[#D4AF37]" : "group-hover:text-white/80")} />
                <span className="font-medium z-10 text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>


    </aside>
  );
}
