function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date) : '-';
}

export function formatTimestamp(value: string | Date | null | undefined): string {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : '-';
}