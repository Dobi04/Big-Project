using ExcursionSaaS.Application.Interfaces.Organisations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace ExcursionSaaS.API.Controllers
{
    [ApiController]
    [EnableRateLimiting("api")]
    [Route("api/Organisation/logo")]
    public class OrganisationLogoController : ControllerBase
    {
        #region Constructor
        private readonly ILogoService _logoService;

        public OrganisationLogoController(ILogoService logoService)
        {
            _logoService = logoService;
        }
        #endregion

        #region Endpoints
        [HttpPost]
        [Authorize(Roles = "Admin,Owner")]
        [RequestSizeLimit(3 * 1024 * 1024)]
        public async Task<IActionResult> UploadLogo(IFormFile file, CancellationToken cancellationToken)
        {
            try
            {
                await using var stream = file.OpenReadStream();
                var url = await _logoService.UploadLogoAsync(stream, cancellationToken);
                return Ok(new { url });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion
    }
}