using ExcursionSaaS.Application.Interfaces.Repositories;
using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Organisations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations.Repositories
{
    public class OrganisationRepository : IOrganisationRepository
    {
        private readonly AppDbContext _appDbContext;

        public OrganisationRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public Task AddAsync(Organisation organisation) => _appDbContext.Organisations.AddAsync(organisation).AsTask();

        public Task AddMemberAsync(OrganisationMember member) => _appDbContext.OrganisationMembers.AddAsync(member).AsTask();

        public Task<List<OrganisationMember>> GetMembershipsByUserAsync(int memberId)
        {
            var organisationMember = _appDbContext.OrganisationMembers
                .Where(m => m.MemberId == memberId)
                .Include(m => m.Organisation)
                    .ThenInclude(o => o.Members)
                .ToListAsync();
            return organisationMember;
        }

        public Task<Organisation?> GetOrganisationByIdAsync(int organisationId)
        {
            var organisation = _appDbContext.Organisations
                .Include(o => o.Members)
                .Include(o => o.Owner)
                .FirstOrDefaultAsync(o => o.Id == organisationId);
            return organisation;
        }

        public async Task<(List<Organisation> Items, int TotalCount)> GetPagedAsync(string? search, string? type, int page, int pageSize)
        {
            var query = BuildPublicActiveQuery(search, type);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(o => o.AverageRating)
                .ThenBy(o => o.OrganisationName)
                .Skip((page-1)* pageSize)
                .Take(pageSize)
                .Include(o => o.Owner)
                .Include(o => o.Members)
                .ToListAsync();

            return (items, totalCount);
        }

        private IQueryable<Organisation> BuildPublicActiveQuery(string? search, string? type)
        {
            var query = _appDbContext.Organisations
                .Where(o => o.Visibility == OrganisationVisibility.Public
                    && o.Status == OrganisationStatus.Active)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(o => o.OrganisationName.Contains(search));

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(o => o.Type == type);

            return query;
        }

        public Task<List<Organisation>> GetPublicActiveByCordinatesAsync()
        {
            var topOrganisations = _appDbContext.Organisations
                .Where(o => o.Visibility == OrganisationVisibility.Public
                         && o.Status == OrganisationStatus.Active
                         && o.Latitude != null && o.Longitude != null)
                .Include(o => o.Owner)
                .Include(o => o.Members)
                .ToListAsync();
            return topOrganisations;
        }

        public Task<List<Organisation>> GetTopByPopularityAsync(int count)
        {
            var topOrganisations = _appDbContext.Organisations
                .Where(o => o.Visibility == OrganisationVisibility.Public
                         && o.Status == OrganisationStatus.Active)
                .OrderByDescending(o => o.Members.Count())
                .ThenByDescending(o => o.AverageRating)
                .Take(count)
                .Include(o => o.Owner)
                .Include(o => o.Members)
                .ToListAsync();
            return topOrganisations;
        }

        public void Remove(Organisation organisation) => _appDbContext.Organisations.Remove(organisation);

        public void RemoveMember(OrganisationMember member) => _appDbContext.OrganisationMembers.Remove(member);

        public Task SaveChangesAsync() => _appDbContext.SaveChangesAsync();
    }
}
