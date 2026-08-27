using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.DTOs
{
    public class LogInDTO
    {
        [System.ComponentModel.DataAnnotations.Required]
        public string Username { get; set; } = string.Empty;
        [System.ComponentModel.DataAnnotations.Required]
        public string Password { get; set; } = string.Empty;
    }
}
