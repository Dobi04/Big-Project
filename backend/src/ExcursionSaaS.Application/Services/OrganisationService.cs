using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Application.Interfaces.Repositories;
using ExcursionSaaS.Application.Interfaces.Organisations;
using ExcursionSaaS.Domain.Enums.Users;
using ExcursionSaaS.Domain.Entities;

namespace ExcursionSaaS.Application.Services
{
    public class OrganisationService : IOrganisationService
    {
        private readonly IOrganisationRepository _organisationRepository;
        private readonly INotificationRepository _notificationRepository;

        public OrganisationService(IOrganisationRepository organisationRepository, INotificationRepository notificationRepository)
        {
            _organisationRepository = organisationRepository;
            _notificationRepository = notificationRepository;
        }

        public async Task<List<JoinedOrganisationDTO>> GetJoinedOrganisationsAsync(int memberId)
        {
            var memberships = await _organisationRepository.GetMembershipsByUserAsync(memberId);
            var unreadNotificationsCount = await _notificationRepository.GetUnreadNotificationCountsForUserAsync(memberId);

            return memberships.Select(m => new JoinedOrganisationDTO
            {
                OrganisationId = m.OrganisationId,
                OrganisationName = m.Organisation.OrganisationName,
                OrganisationLogo = m.Organisation.OrganisationLogo,
                OrganisationDescription = m.Organisation.OrganisationDescription,
                Type = m.Organisation.Type.ToString(),
                Status = m.Organisation.Status.ToString(),
                SubscriptionType = m.Organisation.SubscriptionType.ToString(),
                PaymentStatus = m.PaymentStatus.ToString(),
                MyRole = m.Role.ToString(),
                JoinedAt = m.JoinedAt,
                MemberCount = m.Organisation.Members.Count,
                UnreadNotificationsCount = unreadNotificationsCount.GetValueOrDefault(m.OrganisationId, 0)
            }).ToList();
        }

        public async Task<List<Organisation>> GetTopOrganisationsAsync(double? latitude, double? longitude, int count = 10)
        {
            if (latitude.HasValue && longitude.HasValue)
            {
                var topOrganisations = await _organisationRepository.GetPublicActiveByCordinatesAsync();
                return topOrganisations.Select(o => new
                {
                    Organisation = o,
                    Distance = HaversineDistanceKm(latitude.Value, longitude.Value, o.Latitude ?? 0, o.Longitude ?? 0)
                })
                .OrderBy(x => x.DistanceKm)
                .Take(count)
                .Select(x => ToSummaryDTO(x.Organisation, x.DistanceKm))
                .ToList();
            }
            var top= await _organisationRepository.GetTopByPopularityAsync(count);
            return top.Select(o => ToSummaryDTO(o, distanceKm: null)).ToList();
        }

        public Task<OrganisationDetailsDTO> GetOrganisationByIdAsync(int organisationId)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(int id, UpdateOrganisationDTO updateDto, int requesterId, Roles requesterRole)
        {
            throw new NotImplementedException();
        }
        public Task<OrganisationDetailsDTO> CreateOrganisationAsync(CreateOrganisationDTO createDto, int requesterId, Roles requesterRole)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id, int requesterId, Roles requesterRole)
        {
            throw new NotImplementedException();
        }
    }
}
