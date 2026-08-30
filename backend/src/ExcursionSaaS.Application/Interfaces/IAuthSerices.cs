using ExcursionSaaS.Application.DTOs.AuthDTOs;
using ExcursionSaaS.Application.DTOs.EmailVerificationDTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Interfaces
{
    public interface IAuthServices
    {
        Task<MessageResponseDTO> RegisterAsync(RegistrationDTO dto);
        Task<AuthResponceDTO> LoginAsync(LogInDTO dto);
        Task<AuthResponceDTO> VerifyEmailAsync(VerifyEmailDto dto);
        Task<MessageResponseDTO> ResendVerificationCodeAsync(ResendVerificationCodeDTO dto);
    }
}
