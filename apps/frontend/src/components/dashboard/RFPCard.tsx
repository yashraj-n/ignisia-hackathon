import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import type { RFP } from "../../lib/types";

interface RFPCardProps {
  rfp: RFP;
  onClick: (rfp: RFP) => void;
}

const statusConfig = {
  Processing: { color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", border: "border-[#3B82F6]/20" },
  Accepted: { color: "text-[#22C55E]", bg: "bg-[#22C55E]/10", border: "border-[#22C55E]/20" },
  Rejected: { color: "text-[#EF4444]", bg: "bg-[#EF4444]/10", border: "border-[#EF4444]/20" },
  Pending: { color: "text-[#FACC15]", bg: "bg-[#FACC15]/10", border: "border-[#FACC15]/20" },
};

export default function RFPCard({ rfp, onClick }: RFPCardProps) {
  const statusStyle = statusConfig[rfp.status];
  const hasMissingFields = rfp.missingFields.length > 0;

  return (
    <motion.div
      whileHover={{ 
        y: -2,
        boxShadow: "0 10px 30px -15px rgba(212, 175, 55, 0.2)"
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => onClick(rfp)}
      className="glass-panel rounded-xl p-5 cursor-pointer hover-glow group relative border border-white/5 hover:border-[#D4AF37]/30"
    >
      {hasMissingFields && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 bg-[#EF4444] text-white p-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] z-10"
        >
          <AlertCircle className="w-4 h-4" />
        </motion.div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="text-white font-semibold text-lg leading-tight mb-1 group-hover:text-[#D4AF37] transition-colors line-clamp-1">{rfp.title}</h3>
          <p className="text-muted-foreground text-sm truncate">{rfp.companyName}</p>
        </div>
        <span className={clsx("px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md border shrink-0 transition-colors duration-300", statusStyle.bg, statusStyle.color, statusStyle.border)}>
          {rfp.status}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-4 pt-4 border-t border-white/5 group-hover:border-white/10 transition-colors">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
          {rfp.arrivalDate}
        </div>
        <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
          <Clock className="w-3.5 h-3.5" />
          {rfp.arrivalTime}
        </div>
      </div>
    </motion.div>
  );
}
