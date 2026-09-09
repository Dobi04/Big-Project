namespace ExcursionSaaS.Application.Interfaces.Repositories;

public interface INotificationRepository
{
    Task<Dictionary<int, int>> GetUnreadNotificationCountsForUserAsync(int userId);
}
