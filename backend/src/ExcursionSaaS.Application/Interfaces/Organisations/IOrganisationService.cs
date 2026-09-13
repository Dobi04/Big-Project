using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Users;

namespace ExcursionSaaS.Application.Interfaces.Organisations;

public interface IOrganisationService
{
    #region Query Methods
    Task<List<OrganisationSummaryDTO>> GetTopOrganisationsAsync(double? latitude, double? longitude, int count = 10);
    Task<OrganisationDetailsDTO> GetOrganisationByIdAsync(int organisationId);
    Task<List<JoinedOrganisationDTO>> GetJoinedOrganisationsAsync(int memberId);
    #endregion

    #region Command Methods
    Task<OrganisationDetailsDTO> CreateOrganisationAsync(CreateOrganisationDTO createDto, int requesterId, Roles requesterRole);
    Task UpdateOrganisationAsync(int id, UpdateOrganisationDTO updateDto, int requesterId, Roles requesterRole);
    Task DeleteOrganisationAsync(int id, int requesterId, Roles requesterRole);
    #endregion
}
