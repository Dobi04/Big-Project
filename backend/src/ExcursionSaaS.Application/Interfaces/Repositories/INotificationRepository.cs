namespace ExcursionSaaS.Application.Interfaces.Repositories;

public interface INotificationRepository
{
    #region Query Methods
    Task<Dictionary<int, int>> GetUnreadNotificationCountsForUserAsync(int userId);
    #endregion
}
