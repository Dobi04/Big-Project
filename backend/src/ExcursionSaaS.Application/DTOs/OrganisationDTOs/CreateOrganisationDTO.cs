using System.ComponentModel.DataAnnotations;

namespace ExcursionSaaS.Application.DTOs.OrganisationDTOs
{
    public class CreateOrganisationDTO
    {
        [Required, MaxLength(100)]
        public string OrganisationName { get; set; } = string.Empty;

        [Required, MaxLength(500)]
        public string OrganisationLogo { get; set; } = string.Empty;

        [Required, MaxLength(1000)]
        public string OrganisationDescription { get; set; } = string.Empty;

        [Required]
        public string Visibility { get; set; } = "Private";
        
        [Required, MaxLength(50)]
        public string Type { get; set; } = "NoneAdded";

        [Required]
        public string SubscriptionType { get; set; } = "Free";

        public decimal? MonthlyPrice { get; set; }
        public decimal? YearlyPrice { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
