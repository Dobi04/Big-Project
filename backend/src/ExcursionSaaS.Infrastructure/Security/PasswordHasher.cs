using ExcursionSaaS.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Infrastructure.Security
{
    public class PasswordHasher : IPasswordHasher
    {
        public string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password);

        public bool Verify(string password, string hashedPassword) => BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}
