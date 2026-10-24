using ExcursionSaaS.Domain.Enums.AuditLogs;

namespace ExcursionSaaS.Application.DTOs.AuditLogDTOs
{
    public class AuditLogFilterDTO
    {
        public string? EntityName { get; set; }
        public int? UserId { get; set; }
        public AuditAction? Action { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = PaginationConstants.DefaultPageSize;
    }
}
