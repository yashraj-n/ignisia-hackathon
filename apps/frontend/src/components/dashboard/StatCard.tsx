import { clsx } from "clsx";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 1500; // 1.5s duration for smoothness
    
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setCount(Math.floor(ease * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return <>{count}</>;
}

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
    border: "border-white/5",
    glow: "",
    hoverBorder: "group-hover:border-[#D4AF37]/40",
    hoverGlow: "group-hover:shadow-[0_10px_30px_-10px_rgba(212,175,55,0.2)]",
  },
  accepted: {
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10",
    border: "border-white/5",
    glow: "",
    hoverBorder: "group-hover:border-[#22C55E]/40",
    hoverGlow: "group-hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.2)]",
  },
  rejected: {
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10",
    border: "border-white/5",
    glow: "",
    hoverBorder: "group-hover:border-[#EF4444]/40",
    hoverGlow: "group-hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.2)]",
  },
  pending: {
    color: "text-[#FACC15]",
    bg: "bg-[#FACC15]/10",
    border: "border-white/5",
    glow: "",
    hoverBorder: "group-hover:border-[#FACC15]/40",
    hoverGlow: "group-hover:shadow-[0_10px_30px_-10px_rgba(250,204,21,0.2)]",
  },
};

export default function StatCard({ title, value, change, icon: Icon, variant }: StatCardProps) {
  const isPositive = change >= 0;
  const style = variants[variant];

  return (
    <motion.div
      whileHover={{ 
        y: -4,
        scale: 1.01,
        transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        "glass-panel rounded-xl p-6 relative overflow-hidden group transition-all duration-300 cursor-default border",
        style.border,
        style.glow,
        style.hoverBorder,
        style.hoverGlow
      )}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-[0.02] mix-blend-overlay rounded-bl-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-muted-foreground font-medium text-sm transition-colors group-hover:text-white/80">{title}</h3>
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className={clsx("p-2 rounded-lg transition-all duration-300 relative", style.bg, style.color)}
        >
          <Icon className="w-5 h-5 relative z-10" />
        </motion.div>
      </div>
      
      <div className="flex items-baseline gap-3 relative z-10">
        <span className="text-3xl font-bold text-white tracking-tight">
          <AnimatedNumber value={value} />
        </span>
        <div className={clsx("flex items-center text-sm font-medium", isPositive ? "text-[#22C55E]" : "text-[#EF4444]")}>
          {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
    </motion.div>
  );
}
