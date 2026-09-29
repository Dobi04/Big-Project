import { apiClient } from './client';

export type ChangeRoleResult = { username: string; role: string };

export async function changeRole(role: string): Promise<ChangeRoleResult> {
  const response = await apiClient.post<ChangeRoleResult>('/api/Auth/change-role', { role });
  return response.data;
}