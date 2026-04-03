import { queryOptions } from '@tanstack/react-query';
import type { RFP, RFPAnalytics } from '../lib/types';

const API_BASE = 'http://localhost:9000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
      refetchInterval: 10000,
      staleTime: 5000,
    }),
  list: () =>
    queryOptions({
      queryKey: ['rfps'],
      queryFn: async (): Promise<RFP[]> => {
        const response = await fetch(`${API_BASE}/api/rfp`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error('Could not load RFP list.');
        }
        const data = await response.json();
        return (data.rfps ?? []) as RFP[];
      },
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: ['rfps', id],
      queryFn: async () => {
        const response = await fetch(`${API_BASE}/api/rfp/${id}`, {
          headers: getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error('Could not load RFP details.');
        }
        const data = await response.json();
        return data.rfp ?? null;
      },
      enabled: !!id,
    }),
};

import type { InventoryItem, CompetitorItem } from '../lib/types';

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

