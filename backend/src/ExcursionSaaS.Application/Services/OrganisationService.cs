using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Application.Interfaces.Repositories;
using ExcursionSaaS.Application.Interfaces.Organisations;
using ExcursionSaaS.Domain.Enums.Users;
using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Organisations;

namespace ExcursionSaaS.Application.Services
{
    public class OrganisationService : IOrganisationService
    {
        #region Constants and Constructors
        private readonly IOrganisationRepository _organisationRepository;
        private readonly INotificationRepository _notificationRepository;

        public OrganisationService(IOrganisationRepository organisationRepository, INotificationRepository notificationRepository)
        {
            _organisationRepository = organisationRepository;
            _notificationRepository = notificationRepository;
        }
        #endregion

        #region Public Methods
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

        public async Task<List<OrganisationSummaryDTO>> GetTopOrganisationsAsync(double? latitude, double? longitude, int count = 10)
        {
            if (latitude.HasValue && longitude.HasValue)
            {
                var topOrganisations = await _organisationRepository.GetPublicActiveByCordinatesAsync();
                return topOrganisations.Select(o => new
                {
                    Organisation = o,
                    DistanceKm = HaversineDistanceKm(latitude.Value, longitude.Value, o.Latitude!.Value, o.Longitude!.Value)
                })
                .OrderBy(x => x.DistanceKm)
                .Take(count)
                .Select(x => ToSummaryDTO(x.Organisation, x.DistanceKm))
                .ToList();
            }
            var top = await _organisationRepository.GetTopByPopularityAsync(count);
            return top.Select(o => ToSummaryDTO(o, distanceKm: null)).ToList();
        }

        public async Task<OrganisationDetailsDTO> GetOrganisationByIdAsync(int organisationId)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(organisationId)
                ?? throw new KeyNotFoundException("Organisation not found");
            return ToDetailsDTO(organisation);
        }
        #endregion

        #region Autorised Methods
        public async Task<OrganisationDetailsDTO> CreateOrganisationAsync(CreateOrganisationDTO createDto, int requesterId, Roles requesterRole)
        {
            EnsureCanCreate(requesterRole);
            var organisation = new Organisation
            {
                OrganisationName = createDto.OrganisationName,
                OrganisationLogo = createDto.OrganisationLogo,
                OrganisationDescription = createDto.OrganisationDescription,
                OwnerId = requesterId,
                Visibility = ParseVisibility(createDto.Visibility),
                Type = string.IsNullOrWhiteSpace(createDto.Type) ? "NoneAdded" : createDto.Type,
                SubscriptionType = ParseSubscriptionType(createDto.SubscriptionType),
                MonthlyPrice = createDto.MonthlyPrice,
                YearlyPrice = createDto.YearlyPrice,
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
            };

            await _organisationRepository.AddAsync(organisation);
            await _organisationRepository.SaveChangesAsync();

            await _organisationRepository.AddMemberAsync(new OrganisationMember
            {
                OrganisationId = organisation.Id,
                MemberId = requesterId,
                Role = OrganisationMemberRole.Owner,
                PaymentStatus = MemberSubscriptionStatus.Paid,
                JoinedAt = DateTime.UtcNow
            });
            await _organisationRepository.SaveChangesAsync();

            return await GetOrganisationByIdAsync(organisation.Id);
        }

        public async Task UpdateOrganisationAsync(int id, UpdateOrganisationDTO updateDto, int requesterId, Roles requesterRole)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(id)
                ?? throw new KeyNotFoundException("Organisation not found");

            EnsureCanMenage(organisation, requesterId, requesterRole);

            organisation.OrganisationName = updateDto.OrganisationName;
            organisation.OrganisationLogo = updateDto.OrganisationLogo;
            organisation.OrganisationDescription = updateDto.OrganisationDescription;
            organisation.Visibility = ParseVisibility(updateDto.Visibility);
            organisation.Type = string.IsNullOrWhiteSpace(updateDto.Type) ? "NoneAdded" : updateDto.Type;
            organisation.SubscriptionType = ParseSubscriptionType(updateDto.SubscriptionType);
            organisation.MonthlyPrice = updateDto.MonthlyPrice;
            organisation.YearlyPrice = updateDto.YearlyPrice;
            organisation.Latitude = updateDto.Latitude;
            organisation.Longitude = updateDto.Longitude;

            await _organisationRepository.SaveChangesAsync();
        }

        public async Task DeleteOrganisationAsync(int id, int requesterId, Roles requesterRole)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(id)
                ?? throw new KeyNotFoundException("Organisation not found");

            EnsureCanMenage(organisation, requesterId, requesterRole);

            _organisationRepository.Remove(organisation);
            await _organisationRepository.SaveChangesAsync();
        }
        #endregion

        #region Helper Methods
        private static void EnsureCanCreate(Roles requesterRole)
        {
            if (requesterRole != Roles.Admin && requesterRole != Roles.Owner)
            {
                throw new UnauthorizedAccessException("You do not have permission to create an organisation.");
            }
        }

        private static void EnsureCanMenage(Organisation organisation, int requesterId, Roles requesterRole)
        {
            if (requesterRole == Roles.Admin)
                return; // Admin can manage any organisation

            if (organisation.OwnerId == requesterId)
                return; // Owner can manage their own organisation

            throw new UnauthorizedAccessException("Only Admins and Owners can perform this action on.");
        }

        private static OrganisationVisibility ParseVisibility(string? visibility)
        {
            return Enum.TryParse<OrganisationVisibility>(visibility, ignoreCase: true, out var parsed)
                ? parsed
                : throw new ArgumentException($"Invalid visibility value: '{visibility}'. Expected 'Public' or 'Private'.");
        }

        private static OrganisationSubscriptionType ParseSubscriptionType(string? subscriptionType)
        {
            return Enum.TryParse<OrganisationSubscriptionType>(subscriptionType, ignoreCase: true, out var parsed)
                ? parsed
                : throw new ArgumentException($"Invalid subscription type value: '{subscriptionType}'. Expected 'Free', 'Paid', or 'None'.");
        }

        private static double HaversineDistanceKm(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; // Radius of the Earth in km
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private static double ToRadians(double x) => x * Math.PI / 180;
        #endregion

        #region DTO Conversion Methods
        private static OrganisationSummaryDTO ToSummaryDTO(Organisation organisation, double? distanceKm)
        {
            return new OrganisationSummaryDTO
            {
                Id = organisation.Id,
                OrganisationName = organisation.OrganisationName,
                OrganisationLogo = organisation.OrganisationLogo,
                OrganisationDescription = organisation.OrganisationDescription,
                Type = organisation.Type,
                Visibility = organisation.Visibility.ToString(),
                AverageRating = organisation.AverageRating,
                RatingsCount = organisation.RatingsCount,
                DistanceKm = distanceKm
            };
        }
        private static OrganisationDetailsDTO ToDetailsDTO(Organisation organisation)
        {
            return new OrganisationDetailsDTO
            {
                Id = organisation.Id,
                OrganisationName = organisation.OrganisationName,
                OrganisationLogo = organisation.OrganisationLogo,
                OrganisationDescription = organisation.OrganisationDescription,
                OwnerId = organisation.OwnerId,
                OwnerUsername = organisation.Owner.Username,
                Visibility = organisation.Visibility.ToString(),
                Status = organisation.Status.ToString(),
                Type = organisation.Type,
                SubscriptionType = organisation.SubscriptionType.ToString(),
                MonthlyPrice = organisation.MonthlyPrice,
                YearlyPrice = organisation.YearlyPrice,
                MembersCount = organisation.Members.Count,
                AverageRating = organisation.AverageRating,
                RatingsCount = organisation.RatingsCount,
                Latitude = organisation.Latitude,
                Longitude = organisation.Longitude,
                CreatedAt = organisation.CreatedAt
            };
        }
        #endregion
    }
}
