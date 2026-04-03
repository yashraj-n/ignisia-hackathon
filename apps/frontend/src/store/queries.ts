import { queryOptions } from '@tanstack/react-query';
import type { RFP, RFPStats } from '../lib/types';

const mockStats: RFPStats = {
  total: 142,
  totalChange: 12.5,
  accepted: 84,
  acceptedChange: 8.2,
  rejected: 23,
  rejectedChange: -2.4,
  pending: 35,
  pendingChange: 15.3,
};

const mockRFPs: RFP[] = [
  {
    id: 'rfp-1',
    title: 'Enterprise Cloud Migration',
    companyName: 'Acme Corp',
    arrivalDate: '2023-10-24',
    arrivalTime: '09:30 AM',
    status: 'Processing',
    scopeOfWork: 'Migrate on-premise infrastructure to AWS.',
    infrastructureDetected: ['AWS EC2', 'S3', 'RDS'],
    assetsDetected: ['Web Servers', 'Database'],
    missingFields: ['SLA Response Time', 'Budget Cap'],
  },
  {
    id: 'rfp-2',
    title: 'Cybersecurity Audit & SOC Setup',
    companyName: 'Global Tech',
    arrivalDate: '2023-10-23',
    arrivalTime: '11:15 AM',
    status: 'Pending',
    scopeOfWork: 'Complete security audit and 24/7 SOC establishment.',
    infrastructureDetected: ['Azure Sentinel', 'Fortinet Firewalls'],
    assetsDetected: ['Endpoints', 'Network Devices'],
    missingFields: [],
  },
  {
    id: 'rfp-3',
    title: 'Managed IT Services',
    companyName: 'Retail Giant',
    arrivalDate: '2023-10-22',
    arrivalTime: '02:45 PM',
    status: 'Accepted',
    scopeOfWork: 'End-to-end IT support for 150 retail locations.',
    infrastructureDetected: ['Meraki', 'Windows Server'],
    assetsDetected: ['POS Terminals', 'Office PCs'],
    missingFields: [],
  },
  {
    id: 'rfp-4',
    title: 'Data Center Decommission',
    companyName: 'Old Bank Inc',
    arrivalDate: '2023-10-21',
    arrivalTime: '04:00 PM',
    status: 'Rejected',
    scopeOfWork: 'Securely wipe and decommission legacy data center gear.',
    infrastructureDetected: ['Legacy Mainframe', 'SAN Storage'],
    assetsDetected: ['Hard Drives', 'Servers'],
    missingFields: ['Disposal Certification Requirements'],
  },
];

export const rfpQueries = {
  stats: () =>
    queryOptions({
      queryKey: ['rfp-stats'],
      queryFn: async () => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return mockStats;
      },
    }),
  list: () =>
    queryOptions({
      queryKey: ['rfps'],
      queryFn: async () => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return mockRFPs;
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['rfps', id],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockRFPs.find((r) => r.id === id) || null;
      },
      enabled: !!id,
    }),
};

import type { InventoryItem, CompetitorItem } from '../lib/types';

const API_BASE = 'http://localhost:9000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export const inventoryQueries = {
  list: () =>
    queryOptions({
      queryKey: ['inventory'],
      queryFn: async (): Promise<InventoryItem[]> => {
        const res = await fetch(`${API_BASE}/api/company/inventory`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        return data.items ?? [];
      },
    }),
  competitors: () =>
    queryOptions({
      queryKey: ['competitors'],
      queryFn: async (): Promise<CompetitorItem[]> => {
        const res = await fetch(`${API_BASE}/api/company/competitors`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        return data.competitors ?? [];
      },
    }),
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

function getNameWithoutExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) parts.pop();
  return parts.join('.');
}

export interface UploadPayload {
  file: File;
}

export async function uploadInventory(payload: UploadPayload): Promise<InventoryItem> {
  const base64 = await fileToBase64(payload.file);
  const res = await fetch(`${API_BASE}/api/company/add-inventory`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: getNameWithoutExtension(payload.file.name),
      fileData: base64,
      mimeType: payload.file.type,
      extension: getExtension(payload.file.name),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  const data = await res.json();
  return data.inventory;
}

export async function uploadCompetitor(payload: UploadPayload): Promise<CompetitorItem> {
  const base64 = await fileToBase64(payload.file);
  const res = await fetch(`${API_BASE}/api/company/add-competitor`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name: getNameWithoutExtension(payload.file.name),
      fileData: base64,
      mimeType: payload.file.type,
      extension: getExtension(payload.file.name),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Upload failed');
  }
  const data = await res.json();
  return data.competitor;
}

