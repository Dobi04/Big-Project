using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Application.Interfaces.Repositories;
using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Organisations;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations.Repositories
{
    public class OrganisationRepository : IOrganisationRepository
    {
        #region Constants and Constructor
        private const double EarthRadiusKilometers = 6371d;
        private static readonly Expression<Func<Organisation, OrganisationSummaryProjectionDTO>> SummaryProjection = organisation => new OrganisationSummaryProjectionDTO
        {
            Id = organisation.Id,
            OrganisationName = organisation.OrganisationName,
            OrganisationLogo = organisation.OrganisationLogo,
            OrganisationDescription = organisation.OrganisationDescription,
            Visibility = organisation.Visibility,
            Type = organisation.Type,
            MembersCount = organisation.Members.Count(),
            AverageRating = organisation.AverageRating,
            RatingsCount = organisation.RatingsCount
        };

        private readonly AppDbContext _appDbContext;

        public OrganisationRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
        #endregion

        #region Add Operations
        public Task AddAsync(Organisation organisation) => _appDbContext.Organisations.AddAsync(organisation).AsTask();

        public Task AddMemberAsync(OrganisationMember member) => _appDbContext.OrganisationMembers.AddAsync(member).AsTask();
        #endregion

        #region Query Methods
        public Task<List<JoinedOrganisationProjectionDTO>> GetMembershipsByUserAsync(int memberId)
        {
            return _appDbContext.OrganisationMembers
                .AsNoTracking()
                .Where(m => m.MemberId == memberId)
                .Select(m => new JoinedOrganisationProjectionDTO
                {
                    OrganisationId = m.OrganisationId,
                    OrganisationName = m.Organisation.OrganisationName,
                    OrganisationLogo = m.Organisation.OrganisationLogo,
                    OrganisationDescription = m.Organisation.OrganisationDescription,
                    Type = m.Organisation.Type,
                    Status = m.Organisation.Status,
                    SubscriptionType = m.Organisation.SubscriptionType,
                    PaymentStatus = m.PaymentStatus,
                    Role = m.Role,
                    JoinedAt = m.JoinedAt,
                    MemberCount = m.Organisation.Members.Count()
                })
                .ToListAsync();
        }

        public Task<List<OrganisationSummaryProjectionDTO>> GetOwnedByUserAsync(int ownerId)
        {
            return _appDbContext.Organisations
                .AsNoTracking()
                .Where(o => o.OwnerId == ownerId)
                .OrderByDescending(o => o.CreatedAt)
                .Select(SummaryProjection)
                .ToListAsync();
        }

        public Task<Organisation?> GetOrganisationByIdAsync(int organisationId)
        {
            var organisation = _appDbContext.Organisations
                .Include(o => o.Members)
                .Include(o => o.Owner)
                .FirstOrDefaultAsync(o => o.Id == organisationId);
            return organisation;
        }

        public async Task<(List<OrganisationSummaryProjectionDTO> Items, int TotalCount)> GetPagedAsync(string? search, string? type, int page, int pageSize)
        {
            var query = BuildPublicActiveQuery(search, type);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(o => o.AverageRating)
                .ThenBy(o => o.OrganisationName)
                .Skip((page-1)* pageSize)
                .Take(pageSize)
                .Select(SummaryProjection)
                .ToListAsync();

            return (items, totalCount);
        }
        #endregion

        #region Query Helpers
        private IQueryable<Organisation> BuildPublicActiveQuery(string? search, string? type)
        {
            var query = _appDbContext.Organisations
                .AsNoTracking()
                .Where(o => o.Visibility == OrganisationVisibility.Public
                    && o.Status == OrganisationStatus.Active)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(o => o.OrganisationName.Contains(search));

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(o => o.Type == type);

            return query;
        }
        #endregion

        #region Discovery Queries
        public Task<List<OrganisationSummaryProjectionDTO>> GetPublicActiveByCordinatesAsync(double latitude, double longitude, int count)
        {
            var coordinates = _appDbContext.Organisations
                .AsNoTracking()
                .Where(o => o.Visibility == OrganisationVisibility.Public
                         && o.Status == OrganisationStatus.Active
                         && o.Latitude != null && o.Longitude != null)
                .Select(o => new
                {
                    o.Id,
                    o.OrganisationName,
                    o.OrganisationLogo,
                    o.OrganisationDescription,
                    o.Visibility,
                    o.Type,
                    MembersCount = o.Members.Count(),
                    o.AverageRating,
                    o.RatingsCount,
                    Latitude = o.Latitude!.Value,
                    Longitude = o.Longitude!.Value
                });

            var candidates = coordinates.Select(o => new
            {
                Organisation = o,
                HaversineA = Math.Sin(((o.Latitude - latitude) * Math.PI / 180d) / 2d) *
                    Math.Sin(((o.Latitude - latitude) * Math.PI / 180d) / 2d) +
                    Math.Cos(latitude * Math.PI / 180d) * Math.Cos(o.Latitude * Math.PI / 180d) *
                    Math.Sin(((o.Longitude - longitude) * Math.PI / 180d) / 2d) *
                    Math.Sin(((o.Longitude - longitude) * Math.PI / 180d) / 2d)
            });

            return candidates
                .Select(candidate => new OrganisationSummaryProjectionDTO
                {
                    Id = candidate.Organisation.Id,
                    OrganisationName = candidate.Organisation.OrganisationName,
                    OrganisationLogo = candidate.Organisation.OrganisationLogo,
                    OrganisationDescription = candidate.Organisation.OrganisationDescription,
                    Visibility = candidate.Organisation.Visibility,
                    Type = candidate.Organisation.Type,
                    MembersCount = candidate.Organisation.MembersCount,
                    AverageRating = candidate.Organisation.AverageRating,
                    RatingsCount = candidate.Organisation.RatingsCount,
                    DistanceKm = EarthRadiusKilometers * 2d * Math.Atan2(
                        Math.Sqrt(candidate.HaversineA),
                        Math.Sqrt(1d - candidate.HaversineA))
                })
                .OrderBy(o => o.DistanceKm)
                .Take(count)
                .ToListAsync();
        }

        public Task<List<OrganisationSummaryProjectionDTO>> GetTopByPopularityAsync(int count)
        {
            return _appDbContext.Organisations
                .AsNoTracking()
                .Where(o => o.Visibility == OrganisationVisibility.Public
                         && o.Status == OrganisationStatus.Active)
                .OrderByDescending(o => o.Members.Count())
                .ThenByDescending(o => o.AverageRating)
                .Take(count)
                .Select(SummaryProjection)
                .ToListAsync();
        }
            #endregion

            #region Remove and Save Operations
        public void Remove(Organisation organisation) => _appDbContext.Organisations.Remove(organisation);

        public void RemoveMember(OrganisationMember member) => _appDbContext.OrganisationMembers.Remove(member);

        public Task SaveChangesAsync() => _appDbContext.SaveChangesAsync();
        #endregion
    }
}
