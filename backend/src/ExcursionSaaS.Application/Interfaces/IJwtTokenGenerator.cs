using ExcursionSaaS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}
