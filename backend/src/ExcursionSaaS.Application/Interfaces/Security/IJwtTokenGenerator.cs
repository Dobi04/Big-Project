using ExcursionSaaS.Domain.Entities;

namespace ExcursionSaaS.Application.Interfaces.Security;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
