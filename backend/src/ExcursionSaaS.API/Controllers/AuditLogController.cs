using ExcursionSaaS.Application.DTOs.AuditLogDTOs;
using ExcursionSaaS.Application.Interfaces.AuditLogs;
using ExcursionSaaS.Application.Interfaces.Repositories;
using ExcursionSaaS.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ExcursionSaaS.API.Controllers
{
    [ApiController]
    [Authorize]
    [EnableRateLimiting("api")]
    [Route("api/[controller]")]
    public class AuditLogController : ControllerBase
    {
        #region Constructor
        private readonly IAuditLogServices _auditLogService;

        public AuditLogController(IAuditLogServices auditLogService)
        {
            _auditLogService = auditLogService;
        }
        #endregion

        #region Endpoints
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll([FromQuery] AuditLogFilterDTO filter)
        {
            var result = await _auditLogService.GetAllAsync(filter);
            return Ok(result);
        }

        [HttpGet("entity/{entityName}/{entityId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByEntity(string entityName, string entityId)
        {
            var result = await _auditLogService.GetByEntityAsync(entityName, entityId);
            return Ok(result);
        }
        #endregion
    }
}
