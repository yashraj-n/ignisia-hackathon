import { queryOptions } from '@tanstack/react-query';
import type { RFPItem, RFPStats, InventoryItem, CompetitorItem } from '../lib/types';

const API_BASE = 'http://localhost:9000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export function computeRFPStats(rfps: RFPItem[]): RFPStats {
  const rejectedStatuses = ['parse_rejected', 'explore_rejected', 'summarise_rejected', 'failed'];
  const pendingStatuses = ['parsed', 'exploring', 'explored', 'summarising', 'summarised', 'generating_document'];

  return {
    total: rfps.length,
    totalChange: 0,
    completed: rfps.filter((r) => r.status === 'completed').length,
    completedChange: 0,
    rejected: rfps.filter((r) => rejectedStatuses.includes(r.status)).length,
    rejectedChange: 0,
    pending: rfps.filter((r) => pendingStatuses.includes(r.status)).length,
    pendingChange: 0,
  };
}

async function fetchRFPList(): Promise<RFPItem[]> {
  const res = await fetch(`${API_BASE}/api/rfp`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch RFPs');
  }
  const data = await res.json();
  return data.rfps ?? [];
}

export const rfpQueries = {
  list: () =>
    queryOptions({
      queryKey: ['rfps'],
      queryFn: fetchRFPList,
    }),
  stats: () =>
    queryOptions({
      queryKey: ['rfps'],
      queryFn: fetchRFPList,
      select: (rfps: RFPItem[]): RFPStats => computeRFPStats(rfps),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['rfps', id],
      queryFn: async (): Promise<RFPItem> => {
        const res = await fetch(`${API_BASE}/api/rfp/${id}`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to fetch RFP');
        }
        const data = await res.json();
        return data.rfp;
      },
      enabled: !!id,
    }),
};

export async function exploreRfp(id: string): Promise<RFPItem> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/explore`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Explore failed');
  }
  const data = await res.json();
  return data.rfp;
}

export async function summariseRfp(id: string): Promise<RFPItem> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/summarise`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Summarise failed');
  }
  const data = await res.json();
  return data.rfp;
}

export async function generateDocument(id: string): Promise<{ rfp: RFPItem; documentUrl: string }> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/generate-document`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Document generation failed');
  }
  const data = await res.json();
  return { rfp: data.rfp, documentUrl: data.documentUrl };
}

export async function rejectRfp(id: string, reason: string): Promise<RFPItem> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Rejection failed');
  }
  const data = await res.json();
  return data.rfp;
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
