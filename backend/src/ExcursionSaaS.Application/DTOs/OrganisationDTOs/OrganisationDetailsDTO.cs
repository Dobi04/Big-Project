namespace ExcursionSaaS.Application.DTOs.OrganisationDTOs
{
    public class OrganisationDetailsDTO
    {
        public int Id { get; set; }
        public string OrganisationName { get; set; } = string.Empty;
        public string OrganisationLogo { get; set; } = string.Empty;
        public string OrganisationDescription { get; set; } = string.Empty;
        public int OwnerId { get; set; }
        public string OwnerUsername { get; set; } = string.Empty;
        public string Visibility { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string SubscriptionType { get; set; } = string.Empty;
        public decimal? MonthlyPrice { get; set; }
        public decimal? YearlyPrice { get; set; }
        public int MembersCount { get; set; }
        public decimal AverageRating { get; set; }
        public int RatingsCount { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
