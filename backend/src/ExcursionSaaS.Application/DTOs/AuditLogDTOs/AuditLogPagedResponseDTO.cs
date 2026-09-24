using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.DTOs.AuditLogDTOs
{
    public class AuditLogPagedResponseDTO
    {
        public List<AuditLogResponseDTO> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
