using ExcursionSaaS.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Interfaces
{
    public interface IAuthServices
    {
        Task<AuthResponceDTO> RegisterAsync(RegistrationDTO dto);
        Task<AuthResponceDTO> LoginAsync(LogInDTO dto);
    }
}
