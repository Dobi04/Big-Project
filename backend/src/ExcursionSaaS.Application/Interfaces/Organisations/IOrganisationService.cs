using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Users;

namespace ExcursionSaaS.Application.Interfaces.Organisations;

public interface IOrganisationService
{

    Task<List<Organisation>> GetTopOrganisationsAsync(double? latitude, double? longitude, int count = 10);
    Task<OrganisationDetailsDTO> GetOrganisationByIdAsync(int organisationId);
    Task<OrganisationDetailsDTO> CreateOrganisationAsync(CreateOrganisationDTO createDto, int requesterId, Roles requesterRole);
    Task UpdateAsync(int id, UpdateOrganisationDTO updateDto, int requesterId, Roles requesterRole);
    Task DeleteAsync(int id, int requesterId, Roles requesterRole);
    Task<List<JoinedOrganisationDTO>> GetJoinedOrganisationsAsync(int memberId);
}
