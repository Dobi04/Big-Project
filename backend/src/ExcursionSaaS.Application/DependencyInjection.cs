using ExcursionSaaS.Application.Interfaces;
using ExcursionSaaS.Application.Services;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthServices, AuthServices>();

            return services;
        }
    }
}
