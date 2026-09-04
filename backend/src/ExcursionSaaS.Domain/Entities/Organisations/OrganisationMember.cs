using ExcursionSaaS.Domain.Enums.Organisations;

namespace ExcursionSaaS.Domain.Entities
{
    public class OrganisationMember
    {
        public int Id { get; set; }
        public int OrganisationId { get; set; }
        public Organisation Organisation { get; set; } = new Organisation();
        public int MemberId { get; set; }
        public User Member { get; set; } = new User();
        public OrganisationMemberRole Role { get; set; } = OrganisationMemberRole.Participant;
        public MemberSubscriptionStatus PaymentStatus { get; set; } = MemberSubscriptionStatus.Free;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    }
}
