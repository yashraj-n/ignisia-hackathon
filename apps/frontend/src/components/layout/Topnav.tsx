import { Search, Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';

export default function Topnav() {
  return (
    <header className="h-16 border-b border-white/10 glass-panel flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/logo-bidforge.png" alt="BidForge Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col -gap-1">
          <span className="font-bold text-lg tracking-tight leading-none">
            <span className="text-white">Bid</span>
            <span className="text-[#D4AF37]">Forge</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] leading-none opacity-50">Enterprise</span>
        </div>
      </div>

      <div className="flex-1 max-w-md px-8 relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#D4AF37] transition-colors" />
          <Input 
            placeholder="Search proposals..." 
            className="w-full bg-[#1A1A1A]/50 border-white/10 pl-9 focus-visible:ring-[#D4AF37]/50 rounded-full text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:text-white transition-colors relative hover-glow rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></span>
        </button>
        <button className="p-2 text-muted-foreground hover:text-white transition-colors hover-glow rounded-full">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-8 w-px bg-white/10 mx-2"></div>
        <Avatar className="h-8 w-8 border border-white/10 hover-glow cursor-pointer">
          <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
          <AvatarFallback className="bg-[#1A1A1A] text-xs">US</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
