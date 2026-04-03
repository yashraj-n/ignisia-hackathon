import { X, CheckCircle2, Server, Globe, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RFP } from '../../lib/types';
import { Badge } from '../ui/badge';
import { clsx } from "clsx";

function formatRfpText(text: string) {
  if (!text) return 'No scope provided.';
  const cleaned = text
    .replace(/\#\s?/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\_\_/, '')
    .replace(/\_/, '')
    .replace(/\`/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\n\s*\-\s*/g, '\n• ')
    .replace(/\n\s*\d+\.\s*/g, '\n• ')
    .trim();
  return cleaned;
}

interface RFPDetailsPanelProps {
  rfp: RFP | null;
  onClose: () => void;
}

const statusConfig = {
  Processing: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
  Accepted: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  Rejected: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  Pending: "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20",
};

export default function RFPDetailsPanel({ rfp, onClose }: RFPDetailsPanelProps) {
  return (
    <AnimatePresence>
      {rfp && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[500px] max-w-[90vw] glass-panel border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="p-6 sticky top-0 bg-[#121212]/90 backdrop-blur-md border-b border-white/5 z-10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{rfp.title}</h2>
                <p className="text-sm text-muted-foreground">{rfp.companyName}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-xs uppercase font-bold text-[#D4AF37] mb-3 tracking-wider">Status</h3>
                <Badge variant="outline" className={clsx("font-semibold text-sm px-3 py-1", statusConfig[rfp.status as keyof typeof statusConfig])}>
                  {rfp.status}
                </Badge>
              </div>

              <div>
                <h3 className="text-xs uppercase font-bold text-muted-foreground mb-3 tracking-wider">Scope of Work</h3>
                <div className="text-sm text-[#E5E5E5] leading-relaxed bg-[#1A1A1A]/50 p-4 rounded-xl border border-white/5 space-y-2">
                  {formatRfpText(rfp.scopeOfWork).split('\n').map((line, idx) => (
                    <p key={idx} className="m-0">{line}</p>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs uppercase font-bold text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                    <Server className="w-3.5 h-3.5" /> Infrastructure
                  </h3>
                  <ul className="space-y-2">
                    {rfp.infrastructureDetected?.map(item => (
                      <li key={item} className="text-sm text-[#E5E5E5] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold text-muted-foreground mb-3 tracking-wider flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Assets
                  </h3>
                  <ul className="space-y-2">
                    {rfp.assetsDetected?.map(item => (
                      <li key={item} className="text-sm text-[#E5E5E5] flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {rfp.missingFields && rfp.missingFields.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase font-bold text-[#EF4444] mb-3 tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Missing Fields Detected
                  </h3>
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4">
                    <ul className="space-y-2">
                      {rfp.missingFields.map(field => (
                        <li key={field} className="text-sm text-[#EF4444] font-medium flex items-center gap-2">
                          <X className="w-4 h-4" /> {field} <span className="text-xs ml-auto opacity-70">missing</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {rfp.status !== 'Rejected' && (
              <div className="p-6 mt-auto sticky top-[-100vh] bottom-0 bg-[#121212] border-t border-white/5">
                  <button className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold rounded-lg py-3 flex items-center justify-center gap-2 transition-colors hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                     Generate Strategy Proposal
                  </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
