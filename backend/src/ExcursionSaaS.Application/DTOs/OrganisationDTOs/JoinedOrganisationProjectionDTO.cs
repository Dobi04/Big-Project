using ExcursionSaaS.Domain.Enums.Organisations;

namespace ExcursionSaaS.Application.DTOs.OrganisationDTOs
{
    public class JoinedOrganisationProjectionDTO
    {
        public int OrganisationId { get; set; }
        public string OrganisationName { get; set; } = string.Empty;
        public string OrganisationLogo { get; set; } = string.Empty;
        public string OrganisationDescription { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public OrganisationStatus Status { get; set; }
        public OrganisationSubscriptionType SubscriptionType { get; set; }
        public MemberSubscriptionStatus PaymentStatus { get; set; }
        public OrganisationMemberRole Role { get; set; }
        public DateTime JoinedAt { get; set; }
        public int MemberCount { get; set; }
    }
}