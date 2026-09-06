using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Domain.Enums.Events
{
    public enum EventStatus
    {
        Active = 0,
        Canceled = 1,
        Delayed = 2,
        Pending = 3,
        InProgress = 4,
        Ended = 5,
    }
}
