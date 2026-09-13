using ExcursionSaaS.Application.Interfaces.Authentication;
using ExcursionSaaS.Application.Interfaces.Organisations;
using ExcursionSaaS.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ExcursionSaaS.Application
{
    public static class DependencyInjection
    {
        #region Service Registration
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthServices, AuthServices>();
            services.AddScoped<IOrganisationService, OrganisationService>();

            return services;
        }
        #endregion
    }
}
