import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Settings, User, LogOut, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useRouter } from '@tanstack/react-router';

export default function Topnav({ onToggleSidebar, isSidebarCollapsed }: { onToggleSidebar: () => void, isSidebarCollapsed: boolean }) {
  const [isMeOpen, setIsMeOpen] = useState(false);
  const meRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [profile, setProfile] = useState<{ name: string; login_email: string } | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (meRef.current && !meRef.current.contains(event.target as Node)) {
        setIsMeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:9000/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.company) setProfile(data.company);
        })
        .catch(err => console.error(err));
    }
  }, []);

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.navigate({ to: '/auth' });
  };

  const name = profile?.name || 'Loading...';
  const email = profile?.login_email || '';
  const initials = profile?.name ? getInitials(profile.name) : '..';

  return (
    <header className="h-16 border-b border-white/10 glass-panel flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 mr-2 text-muted-foreground hover:text-[#D4AF37] transition-colors rounded-lg hover:bg-[#D4AF37]/10"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/bidforge-icon.png" alt="BidForge Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-bold text-lg tracking-tight leading-none">
              <span className="text-white">Bid</span>
              <span className="text-[#D4AF37]">Forge</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-none opacity-50">Enterprise</span>
          </div>
        </Link>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:text-white transition-colors relative hover-glow rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></span>
        </button>
        <button className="p-2 text-muted-foreground hover:text-white transition-colors hover-glow rounded-full">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <div className="relative" ref={meRef}>
          <button
            onClick={() => setIsMeOpen(!isMeOpen)}
            className="flex items-center outline-none ring-0 focus:ring-0"
          >
            <Avatar className="h-9 w-9 border border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all cursor-pointer bg-[#1A1A1A]">
              <AvatarFallback className="bg-transparent text-[#D4AF37] font-semibold text-sm">{initials}</AvatarFallback>
            </Avatar>
          </button>

          <AnimatePresence>
            {isMeOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-full mt-3 w-64 glass-panel border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-white/5 bg-[#121212]/95 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)] bg-[#1A1A1A]">
                      <AvatarFallback className="bg-transparent text-[#D4AF37] font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white font-medium text-sm truncate">{name}</span>
                      <span className="text-muted-foreground text-xs truncate">{email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1 bg-[#0A0A0A]/95">
                  <Link
                    to="/profile"
                    onClick={() => setIsMeOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                </div>

                <div className="p-2 border-t border-white/5 bg-[#0A0A0A]/95">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
