using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Domain.Entities;

namespace ExcursionSaaS.Application.Interfaces.Repositories;

public interface IOrganisationRepository
{
    #region Query Methods
    Task<Organisation?> GetOrganisationByIdAsync(int organisationId);
    Task<List<OrganisationSummaryProjectionDTO>> GetTopByPopularityAsync(int count);
    Task<List<OrganisationSummaryProjectionDTO>> GetPublicActiveByCordinatesAsync(double latitude, double longitude, int count);
    Task<List<JoinedOrganisationProjectionDTO>> GetMembershipsByUserAsync(int memberId);
    Task<List<OrganisationSummaryProjectionDTO>> GetOwnedByUserAsync(int ownerId);
    Task<(List<OrganisationSummaryProjectionDTO> Items, int TotalCount)> GetPagedAsync(string? search, string? type, int page, int pageSize);
    #endregion

    #region Command Methods
    Task AddAsync(Organisation organisation);
    Task AddMemberAsync(OrganisationMember member);
    void Remove(Organisation organisation);
    void RemoveMember(OrganisationMember member);
    Task SaveChangesAsync();
    #endregion
}
