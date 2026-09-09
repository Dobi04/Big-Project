using ExcursionSaaS.Application.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _appDbContext;
        public NotificationRepository(AppDbContext context)
        {
            _appDbContext = context;
        }

        public async Task<Dictionary<int, int>> GetUnreadNotificationCountsForUserAsync(int userId)
        {
            var unreadNotifications = await _appDbContext.Notifications
                .Where(n => n.RecipientId == userId && !n.IsRead)
                .GroupBy(n => n.OrganisationId)
                .Select(g => new { OrganisationId = g.Key, UnreadCount = g.Count() })
                .ToDictionaryAsync(x => x.OrganisationId, x => x.UnreadCount);

            return unreadNotifications;
        }
    }
}
