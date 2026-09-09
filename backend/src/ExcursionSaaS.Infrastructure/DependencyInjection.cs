using ExcursionSaaS.Application.Interfaces.Communication;
using ExcursionSaaS.Application.Interfaces.Repositories;
using ExcursionSaaS.Application.Interfaces.Security;
using ExcursionSaaS.Infrastructure.EmailVerification;
using ExcursionSaaS.Infrastructure.Persistence;
using ExcursionSaaS.Infrastructure.Persistence.Configurations.Repositories;
using ExcursionSaaS.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("DefaultConnection is not configured.");

            services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0))));

            services.AddScoped<IPasswordHasher, PasswordHasher>();
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IOrganisationRepository, OrganisationRepository>();
            services.AddScoped<IEmailSender, SmtpEmailSender>();

            services.AddScoped<INotificationRepository, NotificationRepository>();

            return services;
        }
    }
}
