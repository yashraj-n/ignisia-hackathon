import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { clsx } from 'clsx';
import type { RFPItem, RFPStatus } from '../../lib/types';
import RFPCard from './RFPCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

interface RecentRFPsProps {
  rfps: RFPItem[];
  onSelectRFP: (rfp: RFPItem) => void;
}

const statusConfig: Record<RFPStatus, { label: string; className: string }> = {
  parsed:              { label: "Awaiting Review",       className: "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20" },
  exploring:           { label: "Exploring",             className: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20" },
  explored:            { label: "Explored",              className: "bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20" },
  summarising:         { label: "Summarising",           className: "bg-[#A78BFA]/10 text-[#A78BFA] border-[#A78BFA]/20" },
  summarised:          { label: "Summarised",            className: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20" },
  generating_document: { label: "Generating",            className: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20" },
  completed:           { label: "Completed",             className: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20" },
  parse_rejected:      { label: "Rejected (Parse)",      className: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" },
  explore_rejected:    { label: "Rejected (Explore)",    className: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" },
  summarise_rejected:  { label: "Rejected (Summarise)",  className: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" },
  failed:              { label: "Failed",                className: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20" },
  processing:          { label: "Processing",            className: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20" },
};

function truncateInfo(info: string | undefined | null, max = 50): string {
  if (!info) return "Untitled RFP";
  let firstLine = info.split('\n')[0] ?? '';
  firstLine = firstLine.replace(/rfp\s*(\d+)/gi, 'RFP $1');
  return firstLine.length > max ? firstLine.slice(0, max - 1) + '…' : firstLine;
}

export default function RecentRFPs({ rfps, onSelectRFP }: RecentRFPsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <div className="flex items-center bg-[#111111] border border-white/[0.08] rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              "p-1.5 rounded-md transition-colors",
              viewMode === 'grid' ? "bg-[#1A1A1A] text-primary shadow-sm" : "text-muted-foreground hover:text-white"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={clsx(
              "p-1.5 rounded-md transition-colors",
              viewMode === 'table' ? "bg-[#1A1A1A] text-primary shadow-sm" : "text-muted-foreground hover:text-white"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rfps.length > 0 ? (
              rfps.map((rfp) => (
                <RFPCard key={rfp.id} rfp={rfp} onClick={onSelectRFP} />
              ))
            ) : (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`placeholder-${idx}`}
                  className="glass-panel rounded-xl p-4 border border-dashed border-white/10 text-muted-foreground flex flex-col justify-center items-center h-[140px]"
                >
                  <p className="text-sm font-semibold">No recent RFP available</p>
                  <p className="text-xs text-gray-400 mt-2">Upload or ingest an RFP to start tracking</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1A1A1A]/50 border-b border-white/5 hover:bg-transparent">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-muted-foreground">RFP Name</TableHead>
                <TableHead className="text-muted-foreground">Source</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfps.map((rfp) => {
                const st = statusConfig[rfp.status as RFPStatus] || { 
                  label: String(rfp.status).replace(/_/g, ' ') || "Unknown", 
                  className: "bg-white/10 text-white border-white/20" 
                };
                const dateStr = new Date(rfp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return (
                  <TableRow 
                    key={rfp.id} 
                    className="group border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors relative"
                    onClick={() => onSelectRFP(rfp)}
                  >
                    <TableCell className="font-medium text-white relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary group-hover:h-3/5 transition-all duration-300 rounded-r-full" />
                      <span className="pl-4 block">{truncateInfo(rfp.information)}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{rfp.source_email ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {dateStr}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={clsx("font-bold text-[10px] uppercase tracking-wider", st.className)}>
                        {st.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
