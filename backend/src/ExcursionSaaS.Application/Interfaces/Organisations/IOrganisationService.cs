using ExcursionSaaS.Application.DTOs.Common;
using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Users;

namespace ExcursionSaaS.Application.Interfaces.Organisations;

public interface IOrganisationService
{
    #region Query Methods
    Task<List<OrganisationSummaryDTO>> GetTopOrganisationsAsync(double? latitude, double? longitude, int count = 10);
    Task<PagedResponseDTO<OrganisationSummaryDTO>> GetOrganisationsAsync(OrganisationFilterDTO filter);
    Task<OrganisationDetailsDTO> GetOrganisationByIdAsync(int organisationId, int requesterId);
    Task<List<JoinedOrganisationDTO>> GetJoinedOrganisationsAsync(int requesterId);
    #endregion

    #region Command Methods
    Task<OrganisationDetailsDTO> CreateOrganisationAsync(CreateOrganisationDTO createDto, int requesterId, Roles requesterRole);
    Task UpdateOrganisationAsync(int id, UpdateOrganisationDTO updateDto, int requesterId, Roles requesterRole);
    Task DeleteOrganisationAsync(int id, int requesterId, Roles requesterRole);
    Task JoinOrganisationAsync(int organisationId, int requesterId);
    Task LeaveOrganisationAsync(int organisationId, int requesterId);
    Task RemoveFromOrganisationAsync(int organisationId, int requesterId, Roles requesterRole, int memberToRemoveId);
    Task TransferOwnershipAsync(int organisationId, int requesterId, Roles requesterRole, int newOwnerId);
    #endregion
}
