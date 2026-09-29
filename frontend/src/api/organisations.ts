import { apiClient } from './client';
import type { PagedResult } from '../types/paged';
import type { JoinedOrganisation, OrganisationDetails, OrganisationSummary } from '../types/organisation';

export async function getTopOrganisations(count = 5): Promise<OrganisationSummary[]> {
  const response = await apiClient.get<OrganisationSummary[]>('/api/Organisation/top', { params: { count } });
  return response.data;
}

export async function getOrganisations(
  filters: { search: string; type: string },
  page: number,
  pageSize: number,
): Promise<PagedResult<OrganisationSummary>> {
  const response = await apiClient.get<PagedResult<OrganisationSummary>>('/api/Organisation', {
    params: {
      search: filters.search || undefined,
      type: filters.type || undefined,
      page,
      pageSize,
    },
  });
  return response.data;
}

export async function getOrganisationById(id: string): Promise<OrganisationDetails> {
  const response = await apiClient.get<OrganisationDetails>(`/api/Organisation/${id}`);
  return response.data;
}

export async function joinOrganisation(id: string): Promise<void> {
  await apiClient.post(`/api/Organisation/${id}/join`);
}

export async function getJoinedOrganisations(): Promise<JoinedOrganisation[]> {
  const response = await apiClient.get<JoinedOrganisation[]>('/api/Organisation/joined');
  return response.data;
}