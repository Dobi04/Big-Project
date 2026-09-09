namespace ExcursionSaaS.Application.DTOs.OrganisationDTOs
{
    public class OrganisationSummaryDTO
    {
        public int Id { get; set; }
        public string OrganisationName { get; set; } = string.Empty;
        public string OrganisationLogo { get; set; } = string.Empty;
        public string OrganisationDescription { get; set; } = string.Empty;
        public string Visibility { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int MembersCount { get; set; }
        public decimal AverageRating { get; set; }
        public int RatingsCount { get; set; }
        public double? DistanceKm { get; set; }
    }
}
