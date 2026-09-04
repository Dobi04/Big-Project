using ExcursionSaaS.Domain.Enums.Organisations;

namespace ExcursionSaaS.Domain.Entities
{
    public class Organisation
    {
        public int Id { get; set; }
        public string OrganisationLogo { get; set; } = string.Empty;
        public string OrganisationName { get; set; } = string.Empty;
        public string OrganisationDescription { get; set;} = string.Empty;
        public User Owner { get; set; } = new User();
        public ICollection<OrganisationMember> Members { get; set; } = new List<OrganisationMember>();
        public OrganisationVisability Visability { get; set; } = OrganisationVisability.Private;
        public ICollection<Events> Events { get; set; } = new List<Events>();
        public string Type { get; set; } = "NoneAdded";
        public OrganisationStatus Status { get; set; } = OrganisationStatus.Active;
        public OrganisationSubscriptionType SubscriptionType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
