import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Calendar, AlertCircle } from "lucide-react";
import type { RFPItem, RFPStatus } from "../../lib/types";

interface RFPCardProps {
  rfp: RFPItem;
  onClick: (rfp: RFPItem) => void;
}

const statusConfig: Record<RFPStatus, { label: string; color: string; bg: string; border: string }> = {
  parsed:              { label: "Awaiting Review",       color: "text-[#FACC15]", bg: "bg-[#FACC15]/10", border: "border-[#FACC15]/20" },
  exploring:           { label: "Exploring",             color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/20" },
  explored:            { label: "Explored",              color: "text-[#60A5FA]", bg: "bg-[#60A5FA]/10", border: "border-[#60A5FA]/20" },
  summarising:         { label: "Summarising",           color: "text-[#A78BFA]", bg: "bg-[#A78BFA]/10", border: "border-[#A78BFA]/20" },
  summarised:          { label: "Summarised",            color: "text-[#8B5CF6]", bg: "bg-[#8B5CF6]/10", border: "border-[#8B5CF6]/20" },
  generating_document: { label: "Generating",            color: "text-[#F97316]", bg: "bg-[#F97316]/10", border: "border-[#F97316]/20" },
  completed:           { label: "Completed",             color: "text-[#22C55E]", bg: "bg-[#22C55E]/10", border: "border-[#22C55E]/20" },
  parse_rejected:      { label: "Rejected (Parse)",      color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20" },
  explore_rejected:    { label: "Rejected (Explore)",    color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20" },
  summarise_rejected:  { label: "Rejected (Summarise)",  color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20" },
  failed:              { label: "Failed",                color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20" },
  processing:          { label: "Processing",            color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/20" },
};

function getDisplayTitle(information: string): string {
  const firstLine = information.split("\n")[0] ?? "";
  return firstLine.length > 60 ? firstLine.slice(0, 57) + "…" : firstLine;
}

export default function RFPCard({ rfp, onClick }: RFPCardProps) {
  const statusStyle = statusConfig[rfp.status];
  const hasMissingFields = (rfp.parsed_output?.missingFields?.length ?? 0) > 0;
  const displayTitle = getDisplayTitle(rfp.information);
  const displayDate = new Date(rfp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <motion.div
      whileHover={{ 
        y: -5,
        scale: 1.01,
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(234, 179, 8, 0.08)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.2, 
        ease: [0.23, 1, 0.32, 1]
      }}
      onClick={() => onClick(rfp)}
      className="glass-panel rounded-xl p-5 cursor-pointer group relative border border-white/5 transition-colors overflow-visible hover:border-primary/30"
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl overflow-hidden" />
      <div className="absolute inset-x-0 h-[1px] top-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

      {hasMissingFields && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-1.5 -right-1.5 bg-destructive text-white p-1 rounded-full shadow-[0_0_10px_rgba(200,75,107,0.5)] z-20"
        >
          <AlertCircle className="w-4 h-4" />
        </motion.div>
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="text-white font-semibold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{displayTitle}</h3>
          <p className="text-muted-foreground text-sm truncate">{rfp.source_email ?? "Unknown source"}</p>
        </div>
        <motion.span 
          layout
          className={clsx("px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md border shrink-0 transition-colors duration-500", statusStyle.bg, statusStyle.color, statusStyle.border)}
        >
          {statusStyle.label}
        </motion.span>
      </div>
      
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-4 pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors relative z-10">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          {displayDate}
        </div>
      </div>
    </motion.div>
  );
}
