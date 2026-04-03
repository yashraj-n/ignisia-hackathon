export type RFPStatus = 'Processing' | 'Pending' | 'Accepted' | 'Rejected';

export interface RFP {
  id: string;
  title: string;
  companyName: string;
  arrivalDate: string;
  arrivalTime: string;
  status: RFPStatus;
  scopeOfWork: string;
  infrastructureDetected: string[];
  assetsDetected: string[];
  missingFields: string[];
}

export interface RFPStats {
  total: number;
  totalChange: number;
  accepted: number;
  acceptedChange: number;
  rejected: number;
  rejectedChange: number;
  pending: number;
  pendingChange: number;
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
