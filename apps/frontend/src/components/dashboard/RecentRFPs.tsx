import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { clsx } from 'clsx';
import type { RFP } from '../../lib/types';
import RFPCard from './RFPCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

interface RecentRFPsProps {
  rfps: RFP[];
  onSelectRFP: (rfp: RFP) => void;
}

const statusConfig = {
  Processing: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20",
  Accepted: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Pending: "bg-[#FACC15]/10 text-[#FACC15] border-[#FACC15]/20",
};

export default function RecentRFPs({ rfps, onSelectRFP }: RecentRFPsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">Recent RFPs</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rfps.length > 0 ? (
            rfps.slice(0, 4).map((rfp) => (
              <RFPCard key={rfp.id} rfp={rfp} onClick={onSelectRFP} />
            ))
          ) : (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`placeholder-${idx}`}
                className="glass-panel rounded-xl p-5 border border-dashed border-white/10 text-muted-foreground flex flex-col justify-center items-center min-h-[180px]"
              >
                <p className="text-sm font-semibold">No recent RFP available</p>
                <p className="text-xs text-gray-400 mt-2">Upload or ingest an RFP to start tracking</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="glass-panel rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1A1A1A]/50 border-b border-white/5 hover:bg-transparent">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-muted-foreground">RFP Name</TableHead>
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">Arrival Time</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfps.map((rfp) => (
                <TableRow 
                  key={rfp.id} 
                  className="group border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors relative"
                  onClick={() => onSelectRFP(rfp)}
                >
                  <TableCell className="font-medium text-white relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary group-hover:h-3/5 transition-all duration-300 rounded-r-full" />
                    <span className="pl-4 block">{rfp.title}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rfp.companyName}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {rfp.arrivalDate} <span className="text-[10px] opacity-50 ml-1">{rfp.arrivalTime}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={clsx("font-bold text-[10px] uppercase tracking-wider", statusConfig[rfp.status])}>
                      {rfp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
