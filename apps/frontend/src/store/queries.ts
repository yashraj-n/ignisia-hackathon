import { queryOptions } from '@tanstack/react-query';
import type { RFPItem, RFPAnalytics, RFPStats, InventoryItem, CompetitorItem } from '../lib/types';

const API_BASE = 'http://localhost:9000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function computeRFPStats(rfps: RFPItem[]): RFPStats {
  const rejectedStatuses = ['parse_rejected', 'explore_rejected', 'summarise_rejected', 'failed'];
  const pendingStatuses = ['parsed', 'exploring', 'explored', 'summarising', 'summarised', 'generating_document'];

  return {
    total: rfps.length,
    totalChange: 0,
    accepted: rfps.filter((r) => r.status === 'completed').length,
    acceptedChange: 0,
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
  stats: () =>
    queryOptions({
      queryKey: ['rfp-stats'],
      queryFn: async (): Promise<RFPAnalytics> => {
        const response = await fetch(`${API_BASE}/api/rfp/stats`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error('Could not load performance stats.');
        }
        return await response.json();
      },

    }),
  list: () =>
    queryOptions({
      queryKey: ['rfps'],
      queryFn: fetchRFPList,

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


export async function exploreRfp(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/explore`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to trigger explore');
  }
}

export async function summariseRfp(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/summarise`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to trigger summarise');
  }
}

export async function generateDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/generate`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to generate document');
  }
}

export async function rejectRfp(id: string, reason: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/rfp/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to reject RFP');
  }
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
