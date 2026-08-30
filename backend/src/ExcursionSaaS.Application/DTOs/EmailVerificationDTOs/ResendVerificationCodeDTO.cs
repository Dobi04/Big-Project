using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.DTOs.EmailVerificationDTOs
{
    public class ResendVerificationCodeDTO
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
