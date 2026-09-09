using ExcursionSaaS.Application.DTOs.AuthDTOs;
using ExcursionSaaS.Application.DTOs.EmailVerificationDTOs;

namespace ExcursionSaaS.Application.Interfaces.Authentication;

public interface IAuthServices
{
    Task<MessageResponseDTO> RegisterAsync(RegistrationDTO dto);
    Task<AuthResponseDTO> LoginAsync(LogInDTO dto);
    Task<AuthResponseDTO> VerifyEmailAsync(VerifyEmailDto dto);
    Task<MessageResponseDTO> ResendVerificationCodeAsync(ResendVerificationCodeDTO dto);
}
