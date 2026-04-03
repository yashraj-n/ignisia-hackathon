export type RFPStatus =
  | 'processing'
  | 'parsed'
  | 'exploring'
  | 'explored'
  | 'summarising'
  | 'summarised'
  | 'generating_document'
  | 'completed'
  | 'parse_rejected'
  | 'explore_rejected'
  | 'summarise_rejected'
  | 'failed';

export interface RFPParsedOutput {
  parsedContent: string;
  missingFields: string[];
}

export interface SummariserItem {
  name: string;
  current_price: string;
  options: string[];
  avg_competitor_price: string | null;
  recommended_option_index: number;
}

export interface SummariserResponse {
  items: SummariserItem[];
}

export interface RFPItem {
  id: string;
  company_id: string;
  status: RFPStatus;
  information: string;
  source_email: string | null;
  parsed_output: RFPParsedOutput | null;
  explore_output: string | null;
  summarise_output: SummariserResponse | null;
  final_document_url: string | null;
  rejection_reason: string | null;
  rejected_at_step: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RFPStats {
  total: number;
  totalChange?: number;
  completed: number;
  completedChange?: number;
  rejected: number;
  rejectedChange?: number;
  pending: number;
  pendingChange?: number;
}

export interface RFPAnalytics {
  stats: RFPStats & {
    processing: number;
  };
  weekly: Array<{ day: string; count: number }>;
  statusDistribution: {
    accepted: number;
    rejected: number;
    pending: number;
    processing: number;
  };
}

export interface InventoryItem {
  id: string;
  companyId: string;
  name: string;
  s3_url: string;
  information: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorItem {
  id: string;
  companyId: string;
  name: string;
  s3_url: string;
  information: string;
  createdAt: string;
  updatedAt: string;
}
