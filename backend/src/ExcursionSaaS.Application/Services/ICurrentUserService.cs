using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Services
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
        string? Username { get; }
        string? IpAddress { get; }
    }
}
