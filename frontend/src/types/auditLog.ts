export type AuditLogEntry = {
  id: number;
  entityName: string;
  entityId: string;
  action: number;
  userId: string;
  username: string;
  timestamp: string;
  oldValues: string | null;
  newValues: string | null;
  ipAddress: string | null;
};

export const AUDIT_ACTION_OPTIONS = ['Create', 'Update', 'Delete', 'Login', 'LoginFailed'] as const;

export function formatAuditAction(action: number): string {
  return ['Create', 'Update', 'Delete', 'Login', 'Login Failed'][action] ?? 'Unknown';
}