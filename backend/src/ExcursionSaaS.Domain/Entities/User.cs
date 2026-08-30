using ExcursionSaaS.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public Roles Role { get; set; } = Roles.User;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool isEmailVerified { get; set; } = false;
        public string? EmailVerificationCode { get; set; }
        public DateTime? EmailVerificationCodeExpiry { get; set; }
    }
}
