using ExcursionSaaS.Application.DTOs.AuditLogDTOs;
using ExcursionSaaS.Application.DTOs.Common;

namespace ExcursionSaaS.Application.Interfaces.AuditLogs
{
    public interface IAuditLogServices
    {
        #region Query Methods
        Task<PagedResponseDTO<AuditLogResponseDTO>> GetAllAsync(AuditLogFilterDTO filter);
        Task<List<AuditLogResponseDTO>> GetByEntityAsync(string entityName, string entityId);
        #endregion
    }
}
