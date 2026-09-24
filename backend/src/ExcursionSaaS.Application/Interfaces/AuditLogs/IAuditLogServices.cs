using ExcursionSaaS.Application.DTOs.AuditLogDTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Interfaces.AuditLogs
{
    public interface IAuditLogServices
    {
        Task<AuditLogPagedResponseDTO> GetAllAsync(AuditLogFilterDTO filter);
        Task<List<AuditLogResponseDTO>> GetByEntityAsync(string entityName, string entityId);
    }
}
