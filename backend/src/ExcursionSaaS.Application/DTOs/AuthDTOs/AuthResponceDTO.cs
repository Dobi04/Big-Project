using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.DTOs.AuthDTOs
{
    public class AuthResponceDTO
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}
