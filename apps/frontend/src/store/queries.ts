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
