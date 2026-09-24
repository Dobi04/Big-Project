using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Domain.Enums.AuditLogs
{
    public enum AuditAction
    {
        Create = 0,
        Update = 1,
        Delete = 2,
        Login = 3,
        LoginFailed = 4
    }
}
