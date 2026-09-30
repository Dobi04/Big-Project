using ExcursionSaaS.Application.Interfaces;
using System.Security.Claims;

namespace ExcursionSaaS.API.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        #region Constructor
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            this._httpContextAccessor = httpContextAccessor;
        }
        #endregion

        #region Current User Claims
        public int? UserId
        {
            get
            {
                var value = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
                return int.TryParse(value, out var userId) ? userId : null;
            }
        }

        public string? Username => _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);

        public string? IpAddress => _httpContextAccessor.HttpContext?.Connection.RemoteIpAddress?.ToString();
        #endregion
    }
}
