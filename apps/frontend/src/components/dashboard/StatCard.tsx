import { clsx } from "clsx";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  variant: "total" | "accepted" | "rejected" | "pending";
}

const variants = {
  total: {
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10",
    border: "group-hover:border-[#D4AF37]/40",
    glow: "group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]",
  },
  accepted: {
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    border: "group-hover:border-[#22C55E]/40",
    glow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]",
  },
  rejected: {
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "group-hover:border-[#EF4444]/40",
    glow: "group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  },
  pending: {
    color: "text-[#FACC15]",
    bg: "bg-[#FACC15]/10",
    border: "group-hover:border-[#FACC15]/40",
    glow: "group-hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]",
  },
};

export default function StatCard({ title, value, change, icon: Icon, variant }: StatCardProps) {
  const isPositive = change >= 0;
  const style = variants[variant];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={clsx(
        "glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-300 cursor-default",
        style.border,
        style.glow
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.02] mix-blend-overlay rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-muted-foreground font-medium text-sm transition-colors group-hover:text-white/80">{title}</h3>
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.1 }}
          className={clsx("p-2 rounded-lg transition-all duration-300", style.bg, style.color)}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
      </div>
      
      <div className="flex items-baseline gap-3 relative z-10">
        <motion.span 
          initial={false}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="text-3xl font-bold text-white tracking-tight"
        >
          {value}
        </motion.span>
        <div className={clsx("flex items-center text-sm font-medium", isPositive ? "text-[#22C55E]" : "text-[#EF4444]")}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
    </motion.div>
  );
}
