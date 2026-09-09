using ExcursionSaaS.Domain.Entities;

namespace ExcursionSaaS.Application.Interfaces.Repositories;

public interface IOrganisationRepository
{
    Task<Organisation?> GetOrganisationByIdAsync(int organisationId);
    Task<List<Organisation>> GetTopByPopularityAsync(int count);
    Task<List<Organisation>> GetPublicActiveByCordinatesAsync();
    Task<List<OrganisationMember>> GetMembershipsByUserAsync(int memberId);

    Task AddAsync(Organisation organisation);
    Task AddMemberAsync(OrganisationMember member);
    void Remove(Organisation organisation);
    void RemoveMember(OrganisationMember member);
    Task SaveChangesAsync();
}
