using ExcursionSaaS.Application.DTOs.OrganisationDTOs;
using ExcursionSaaS.Application.Interfaces.Organisations;
using ExcursionSaaS.Domain.Enums.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExcursionSaaS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganisationControler : ControllerBase
    {
        #region Constants and Constructors
        private readonly IOrganisationService _organisationService;

        public OrganisationControler(IOrganisationService organisationService)
        {
            _organisationService = organisationService;
        }
        #endregion

        #region Organisation Endpoints
        [HttpGet("top")]
        public async Task<IActionResult> GetTopOrganisations([FromQuery] double? latitude, [FromQuery] double? longitude, [FromQuery] int count = 10)
        {
            if (count <= 0 || count > 50)
            {
                count = 10; // Default to 10 if the count is invalid
            }

            var organisations = await _organisationService.GetTopOrganisationsAsync(latitude, longitude, count);
            return Ok(organisations);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetOrganisationById(int id)
        {
            try
            {
                var organisation = await _organisationService.GetOrganisationByIdAsync(id, GetUserId());
                return Ok(organisation);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("joined")]
        [Authorize]
        public async Task<IActionResult> GetJoinedOrganisations()
        {
            var organisations = await _organisationService.GetJoinedOrganisationsAsync(GetUserId());
            return Ok(organisations);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Owner")]
        public async Task<IActionResult> CreateOrganisation(CreateOrganisationDTO createDto)
        {
            try
            {
                var organisation = await _organisationService.CreateOrganisationAsync(createDto, GetUserId(), GetUserRole());
                return CreatedAtAction(nameof(GetOrganisationById), new { id = organisation.Id }, organisation);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Owner")]
        public async Task<IActionResult> UpdateOrganisation(int id, UpdateOrganisationDTO updateDto)
        {
            try
            {
                await _organisationService.UpdateOrganisationAsync(id, updateDto, GetUserId(), GetUserRole());
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteOrganisation(int id)
        {
            try
            {
                await _organisationService.DeleteOrganisationAsync(id, GetUserId(), GetUserRole());
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost("{id:int}/join")]
        [Authorize]
        public async Task<IActionResult> JoinOrganisation(int id)
        {
            try
            {
                await _organisationService.JoinOrganisationAsync(id, GetUserId());
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}/leave")]
        [Authorize]
        public async Task<IActionResult> LeaveOrganisation(int id)
        {
            try
            {
                await _organisationService.LeaveOrganisationAsync(id, GetUserId());
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}/members/{memberId:int}")]
        [Authorize]
        public async Task<IActionResult> RemoveMemberFromOrganisation(int id, int memberId)
        {
            try
            {
                await _organisationService.RemoveFromOrganisationAsync(id, GetUserId(), GetUserRole(), memberId);
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPost("{id:int}/promote/{memberId:int}")]
        [Authorize]
        public async Task<IActionResult> TransferOwnership(int id, int memberId)
        {
            try
            {
                await _organisationService.TransferOwnershipAsync(id, GetUserId(), GetUserRole(), memberId);
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        #endregion

        #region Helper Methods
        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User ID claim not found."));
        }

        private Roles GetUserRole()
        {
            return Enum.Parse<Roles>(User.FindFirstValue(ClaimTypes.Role)
                ?? throw new UnauthorizedAccessException("Role claim not found."));
        }
        #endregion
    }
}
