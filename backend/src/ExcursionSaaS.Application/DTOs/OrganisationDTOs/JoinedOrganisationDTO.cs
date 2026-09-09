namespace ExcursionSaaS.Application.DTOs.OrganisationDTOs
{
    public class JoinedOrganisationDTO
    {
        public int OrganisationId { get; set; }
        public string OrganisationName { get; set; } = string.Empty;
        public string OrganisationLogo { get; set; } = string.Empty;
        public string OrganisationDescription { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string SubscriptionType { get; set; } = string.Empty;
        public string PaymentStatus { get; set; } = string.Empty;
        public string MyRole { get; set; } = string.Empty;
        public DateTime JoinedAt { get; set; }
        public int MemberCount { get; set; }
        public int UnreadNotificationsCount { get; set; }
    }
}
