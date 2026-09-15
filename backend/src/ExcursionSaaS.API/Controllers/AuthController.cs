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
    [EnableRateLimiting("auth")]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        #region Constants and Constructors
        private readonly IAuthServices _authService;

        public AuthController(IAuthServices authService)
        {
            _authService = authService;
        }
        #endregion

        #region Authentication Endpoints
        [HttpPost("register")]
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
        public async Task<IActionResult> Login(LogInDTO dto)
        {
            try
            {
                var result = await _authService.LoginAsync(dto);
                SetAuthCookie(result.Token);
                result.Token = string.Empty;
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(VerifyEmailDto dto)
        {
            try
            {
                var result = await _authService.VerifyEmailAsync(dto);
                SetAuthCookie(result.Token);
                result.Token = string.Empty;
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
        #endregion

        #region Helpers
        private void SetAuthCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            };
            Response.Cookies.Append("authToken", token, cookieOptions);
        }
        #endregion
    }
}
