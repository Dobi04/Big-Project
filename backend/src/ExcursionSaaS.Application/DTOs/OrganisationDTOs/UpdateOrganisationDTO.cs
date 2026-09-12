using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ExcursionSaaS.Application.DTOs.OrganisationDTOs
{
    public class UpdateOrganisationDTO
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

        [Range(0, double.MaxValue, ErrorMessage = "MonthlyPrice must be zero or positive.")]
        public decimal? MonthlyPrice { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "YearlyPrice must be zero or positive.")]
        public decimal? YearlyPrice { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90.")]
        public double? Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180.")]
        public double? Longitude { get; set; }
    }
}
