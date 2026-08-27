using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.DTOs
{
    public class RegistrationDTO
    {
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(100)]
        public string Name { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(100)]
        public string Surname { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.EmailAddress]
        [System.ComponentModel.DataAnnotations.StringLength(100)]
        public string Email { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        [System.ComponentModel.DataAnnotations.MinLength(8)]
        public string Password { get; set; } = string.Empty;
    }
}
