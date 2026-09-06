using ExcursionSaaS.Domain.Enums.Notifications;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }

        public int RecipientId { get; set; }
        public User Recipient { get; set; } = null!;

        public int OrganisationId { get; set; }
        public Organisation Organisation { get; set; } = null!;

        public NotificationType Type { get; set; } = NotificationType.General;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
