using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Application.Interfaces.Repositories;
using ExcursionSaaS.Application.Interfaces.Organisations;
using ExcursionSaaS.Domain.Enums.Users;
using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Organisations;
using ExcursionSaaS.Application.DTOs.Common;

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
        public async Task<List<JoinedOrganisationDTO>> GetJoinedOrganisationsAsync(int requesterId)
        {
            var memberships = await _organisationRepository.GetMembershipsByUserAsync(requesterId);
            var unreadNotificationsCount = await _notificationRepository.GetUnreadNotificationCountsForUserAsync(requesterId);

            return memberships.Select(m => new JoinedOrganisationDTO
            {
                OrganisationId = m.OrganisationId,
                OrganisationName = m.OrganisationName,
                OrganisationLogo = m.OrganisationLogo,
                OrganisationDescription = m.OrganisationDescription,
                Type = m.Type,
                Status = m.Status.ToString(),
                SubscriptionType = m.SubscriptionType.ToString(),
                PaymentStatus = m.PaymentStatus.ToString(),
                MyRole = m.Role.ToString(),
                JoinedAt = m.JoinedAt,
                MemberCount = m.MemberCount,
                UnreadNotificationsCount = unreadNotificationsCount.GetValueOrDefault(m.OrganisationId, 0)
            }).ToList();
        }

        public async Task<List<OrganisationSummaryDTO>> GetOwnedOrganisationsAsync(int requesterId)
        {
            var owned = await _organisationRepository.GetOwnedByUserAsync(requesterId);
            return owned.Select(ToSummaryDTO).ToList();
        }

        public async Task<List<OrganisationSummaryDTO>> GetTopOrganisationsAsync(double? latitude, double? longitude, int count = 10)
        {
            if (latitude.HasValue && longitude.HasValue)
            {
                var topOrganisations = await _organisationRepository.GetPublicActiveByCordinatesAsync(latitude.Value, longitude.Value, count);
                return topOrganisations.Select(ToSummaryDTO).ToList();
            }
            var top = await _organisationRepository.GetTopByPopularityAsync(count);
            return top.Select(ToSummaryDTO).ToList();
        }

        public async Task<OrganisationDetailsDTO> GetOrganisationByIdAsync(int organisationId, int requesterId)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(organisationId)
                ?? throw new KeyNotFoundException("Organisation not found");

            var isMember = organisation.OwnerId == requesterId || organisation.Members.Any(m => m.MemberId == requesterId);

            if (organisation.Visibility != OrganisationVisibility.Public && !isMember)
                throw new UnauthorizedAccessException("You are not authorized to view this organisation.");
            if (organisation.Status != OrganisationStatus.Active && organisation.OwnerId != requesterId)
                throw new InvalidOperationException("This organisation is not active.");

            return ToDetailsDTO(organisation, requesterId);
        }

        public async Task JoinOrganisationAsync(int organisationId, int requesterId)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(organisationId)
                ?? throw new KeyNotFoundException("Organisation not found");

            if(organisation.Visibility == OrganisationVisibility.Private)   //will need a check for invitation in the future
                throw new UnauthorizedAccessException("You cannot join a private organisation without an invitation.");
            if(organisation.Status != OrganisationStatus.Active)
                throw new InvalidOperationException("You cannot join an organisation that is not active.");

            var alreadyMember = organisation.OwnerId == requesterId || organisation.Members.Any(m => m.MemberId == requesterId);
            if (alreadyMember)
                throw new InvalidOperationException("You are already a member of this organisation.");

            var paymentStatus = organisation.SubscriptionType == OrganisationSubscriptionType.Free
                ? MemberSubscriptionStatus.Free
                : MemberSubscriptionStatus.PendingPayment;

            await _organisationRepository.AddMemberAsync(new OrganisationMember
            {
                OrganisationId = organisationId,
                MemberId = requesterId,
                Role = OrganisationMemberRole.Participant,
                PaymentStatus = paymentStatus,
                JoinedAt = DateTime.UtcNow
            });

            await _organisationRepository.SaveChangesAsync();
        }

        public async Task LeaveOrganisationAsync(int organisationId, int requesterId)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(organisationId)
                ?? throw new KeyNotFoundException("Organisation not found");

            var membership = organisation.Members.FirstOrDefault(m => m.MemberId == requesterId);
            if (membership == null)
                throw new KeyNotFoundException("You are not a member of this organisation.");

            if (organisation.OwnerId == requesterId)
                throw new InvalidOperationException("The owner cannot leave the organisation. Consider transferring ownership or deleting the organisation.");


            _organisationRepository.RemoveMember(membership);
            await _organisationRepository.SaveChangesAsync();
        }

        public async Task<PagedResponseDTO<OrganisationSummaryDTO>> GetOrganisationsAsync(OrganisationFilterDTO filter)
        {
            var page = Math.Max(filter.Page, 1);
            var pageSize = filter.PageSize <= 0 ? 20 : Math.Clamp(filter.PageSize, 1, 100);

            var result = await _organisationRepository.GetPagedAsync(filter.Search, filter.Type, page, pageSize);

            return new PagedResponseDTO<OrganisationSummaryDTO>
            {
                Items = result.Items.Select(ToSummaryDTO).ToList(),
                TotalCount = result.TotalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = result.TotalCount == 0 ? 0 : (int)Math.Ceiling(result.TotalCount / (double)pageSize)
            };
        }
        #endregion

        #region Authorized Methods
        public async Task<OrganisationDetailsDTO> CreateOrganisationAsync(CreateOrganisationDTO createDto, int requesterId, Roles requesterRole)
        {
            EnsureCanCreate(requesterRole);
            // TODO: limit the number of organisations a user can create based on their plan (later)
            var visibility = ParseVisibility(createDto.Visibility);
            var subscriptionType = ParseSubscriptionType(createDto.SubscriptionType);
            ValidatePricing(subscriptionType, createDto.MonthlyPrice, createDto.YearlyPrice);

            var organisation = new Organisation
            {
                OrganisationName = createDto.OrganisationName,
                OrganisationLogo = createDto.OrganisationLogo,
                OrganisationDescription = createDto.OrganisationDescription,
                OwnerId = requesterId,
                Visibility = visibility,
                Type = string.IsNullOrWhiteSpace(createDto.Type) ? "NoneAdded" : createDto.Type,
                SubscriptionType = subscriptionType,
                MonthlyPrice = createDto.MonthlyPrice,
                YearlyPrice = createDto.YearlyPrice,
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
            };

            organisation.Members.Add(new OrganisationMember
            {
                MemberId = requesterId,
                Role = OrganisationMemberRole.Owner,
                PaymentStatus = MemberSubscriptionStatus.Paid,
                JoinedAt = DateTime.UtcNow
            });

            await _organisationRepository.AddAsync(organisation);
            await _organisationRepository.SaveChangesAsync();

            return await GetOrganisationByIdAsync(organisation.Id, requesterId);
        }

        public async Task UpdateOrganisationAsync(int id, UpdateOrganisationDTO updateDto, int requesterId, Roles requesterRole)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(id)
                ?? throw new KeyNotFoundException("Organisation not found");

            EnsureCanManage(organisation, requesterId, requesterRole);

            var visibility = ParseVisibility(updateDto.Visibility);
            var subscriptionType = ParseSubscriptionType(updateDto.SubscriptionType);
            ValidatePricing(subscriptionType, updateDto.MonthlyPrice, updateDto.YearlyPrice);

            organisation.OrganisationName = updateDto.OrganisationName;
            organisation.OrganisationLogo = updateDto.OrganisationLogo;
            organisation.OrganisationDescription = updateDto.OrganisationDescription;
            organisation.Visibility = visibility;
            organisation.Type = string.IsNullOrWhiteSpace(updateDto.Type) ? "NoneAdded" : updateDto.Type;
            organisation.SubscriptionType = subscriptionType;
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

            EnsureCanManage(organisation, requesterId, requesterRole);

            _organisationRepository.Remove(organisation);
            await _organisationRepository.SaveChangesAsync();
        }

        public async Task RemoveFromOrganisationAsync(int organisationId, int requesterId, Roles requesterRole, int memberToRemoveId)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(organisationId)
                ?? throw new KeyNotFoundException("Organisation not found");

            EnsureCanManage(organisation, requesterId, requesterRole);

            if (memberToRemoveId == requesterId)
                throw new InvalidOperationException("You cannot remove yourself from the organisation.");
            if (organisation.OwnerId == memberToRemoveId)
                throw new InvalidOperationException("You cannot remove the owner from the organisation.");
            
            var membership = organisation.Members.FirstOrDefault(m => m.MemberId == memberToRemoveId);
            if (membership == null)
                throw new InvalidOperationException("The specified user is not a member of this organisation.");

            _organisationRepository.RemoveMember(membership);
            await _organisationRepository.SaveChangesAsync();
        }

        public async Task TransferOwnershipAsync(int organisationId, int requesterId, Roles requesterRole, int newOwnerId)
        {
            var organisation = await _organisationRepository.GetOrganisationByIdAsync(organisationId)
                ?? throw new KeyNotFoundException("Organisation not found");

            EnsureCanManage(organisation, requesterId, requesterRole);

            if (newOwnerId == organisation.OwnerId)
                throw new InvalidOperationException("The new owner is already the owner of the organisation.");

            var newOwnerMembership = organisation.Members.FirstOrDefault(m => m.MemberId == newOwnerId);
            if (newOwnerMembership == null)
                throw new InvalidOperationException("The specified user is not a member of this organisation.");

            var previousOwnerMembership = organisation.Members.FirstOrDefault(m => m.MemberId == organisation.OwnerId);
            if (previousOwnerMembership != null)
            {
                previousOwnerMembership.Role = OrganisationMemberRole.Participant;
            }

            organisation.OwnerId = newOwnerId;
            newOwnerMembership.Role = OrganisationMemberRole.Owner;
            
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

        private static void EnsureCanManage(Organisation organisation, int requesterId, Roles requesterRole)
        {
            if (requesterRole == Roles.Admin)
                return; // Admin can manage any organisation

            if (organisation.OwnerId == requesterId)
                return; // Owner can manage their own organisation

            throw new UnauthorizedAccessException("Only administrators and organisation owners can perform this action.");
        }

        private static OrganisationVisibility ParseVisibility(string? visibility)
        {
            var value = visibility?.Trim();
            return value != null
                && Enum.TryParse<OrganisationVisibility>(value, ignoreCase: true, out var parsed)
                && Enum.IsDefined(parsed)
                && Enum.GetNames<OrganisationVisibility>().Contains(value, StringComparer.OrdinalIgnoreCase)
                    ? parsed
                    : throw new ArgumentException($"Invalid visibility value: '{visibility}'. Expected 'Public' or 'Private'.");
        }

        private static OrganisationSubscriptionType ParseSubscriptionType(string? subscriptionType)
        {
            var value = subscriptionType?.Trim();
            return value != null
                && Enum.TryParse<OrganisationSubscriptionType>(value, ignoreCase: true, out var parsed)
                && Enum.IsDefined(parsed)
                && Enum.GetNames<OrganisationSubscriptionType>().Contains(value, StringComparer.OrdinalIgnoreCase)
                    ? parsed
                    : throw new ArgumentException($"Invalid subscription type value: '{subscriptionType}'. Expected 'Free' or 'Paid'.");
        }

        private static void ValidatePricing(OrganisationSubscriptionType subscriptionType, decimal? monthlyPrice, decimal? yearlyPrice)
        {
            if (subscriptionType == OrganisationSubscriptionType.Paid
                && monthlyPrice.GetValueOrDefault() <= 0
                && yearlyPrice.GetValueOrDefault() <= 0)
            {
                throw new ArgumentException("Paid organisations must have a monthly or yearly price greater than zero.");
            }

            if (subscriptionType == OrganisationSubscriptionType.Free && (monthlyPrice.HasValue || yearlyPrice.HasValue))
            {
                throw new ArgumentException("Free organisations must not specify monthly or yearly prices.");
            }
        }

        #endregion

        #region DTO Conversion Methods
        private static OrganisationSummaryDTO ToSummaryDTO(OrganisationSummaryProjectionDTO organisation)
        {
            return new OrganisationSummaryDTO
            {
                Id = organisation.Id,
                OrganisationName = organisation.OrganisationName,
                OrganisationLogo = organisation.OrganisationLogo,
                OrganisationDescription = organisation.OrganisationDescription,
                Type = organisation.Type,
                Visibility = organisation.Visibility.ToString(),
                MembersCount = organisation.MembersCount,
                AverageRating = organisation.AverageRating,
                RatingsCount = organisation.RatingsCount,
                DistanceKm = organisation.DistanceKm
            };
        }
        private static OrganisationDetailsDTO ToDetailsDTO(Organisation organisation, int requesterId)
        {
            return new OrganisationDetailsDTO
            {
                Id = organisation.Id,
                OrganisationName = organisation.OrganisationName,
                OrganisationLogo = organisation.OrganisationLogo,
                OrganisationDescription = organisation.OrganisationDescription,
                OwnerId = organisation.OwnerId,
                IsMember = organisation.OwnerId == requesterId || organisation.Members.Any(m => m.MemberId == requesterId),
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
