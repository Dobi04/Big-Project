namespace ExcursionSaaS.Application.Interfaces
{
    public interface ICurrentUserService
    {
        #region Current User Context
        int? UserId { get; }
        string? Username { get; }
        string? IpAddress { get; }
        #endregion
    }
}
