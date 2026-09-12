using ExcursionSaaS.Application.DTOs.AuthDTOs;
using ExcursionSaaS.Application.DTOs.EmailVerificationDTOs;
using ExcursionSaaS.Application.Interfaces.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace ExcursionSaaS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authService;

        public AuthController(IAuthServices authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Register(RegistrationDTO dto)
        {
            try
            {
                var result = await _authService.RegisterAsync(dto);
                return Ok(result);

            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (DbUpdateException)
            {
                return Ok(new MessageResponseDTO
                {
                    Message = "Registration successful. Please check your email for the verification code."
                });
            }
        }

        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Login(LogInDTO dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("verify-email")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailDto dto)
        {
            try
            {
                var result = await _authService.VerifyEmailAsync(dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }

        [HttpPost("resend-code")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> ResendCode(ResendVerificationCodeDTO dto)
        {
            try
            {
                var result = await _authService.ResendVerificationCodeAsync(dto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                {
                    return BadRequest(new { message = ex.Message });
                }
            }
        }
    }
}
