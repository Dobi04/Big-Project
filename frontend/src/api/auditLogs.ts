import { apiClient } from './client';
import type { PagedResult } from '../types/paged';
import type { AuditLogEntry } from '../types/auditLog';

export type AuditLogFilters = {
  entityName: string;
  action: string;
  dateFrom: string;
  dateTo: string;
};

export async function getAuditLogs(
  filters: AuditLogFilters,
  page: number,
  pageSize: number,
): Promise<PagedResult<AuditLogEntry>> {
  const response = await apiClient.get<PagedResult<AuditLogEntry>>('/api/AuditLog', {
    params: {
      entityName: filters.entityName || undefined,
      action: filters.action || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      page,
      pageSize,
    },
  });
  return response.data;
}