using ExcursionSaaS.Domain.Enums.Organisations;

namespace ExcursionSaaS.Domain.Entities
{
    public class Organisation
    {
        public int Id { get; set; }
        public string OrganisationLogo { get; set; } = string.Empty;
        public string OrganisationName { get; set; } = string.Empty;
        public string OrganisationDescription { get; set;} = string.Empty;
        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;
        public ICollection<OrganisationMember> Members { get; set; } = new List<OrganisationMember>();
        public OrganisationVisibility Visibility { get; set; } = OrganisationVisibility.Private;
        public ICollection<Event> Events { get; set; } = new List<Event>();
        public string Type { get; set; } = "NoneAdded";
        public OrganisationStatus Status { get; set; } = OrganisationStatus.Active;
        public OrganisationSubscriptionType SubscriptionType { get; set; }
        public decimal? MonthlyPrice { get; set; }
        public decimal? YearlyPrice { get; set; }
        public decimal AverageRating { get; set; } = 0m;
        public int RatingsCount { get; set; } = 0;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
