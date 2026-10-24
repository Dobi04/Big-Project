namespace ExcursionSaaS.Application.DTOs.OrganisationDTOs
{
    public class OrganisationFilterDTO
    {
        public string? Search { get; set; }
        public string? Type { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
