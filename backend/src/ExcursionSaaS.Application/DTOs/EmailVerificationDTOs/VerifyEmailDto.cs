using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.DTOs.EmailVerificationDTOs
{
    public class VerifyEmailDto
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        public string Email { get; set; } = string.Empty;

        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(6, MinimumLength = 6)]
        public string Code { get; set; } = string.Empty;
    }
}
