using ExcursionSaaS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> FindByUsernameAsync(string username);
        Task<User?> FindByEmailAsync(string email);
        Task<PendingUserRegistration?> FindPendingByUsernameAsync(string username);
        Task<PendingUserRegistration?> FindPendingByEmailAsync(string email);
        Task Add(User user);
        Task AddPendingAsync(PendingUserRegistration registration);
        Task RemovePendingAsync(PendingUserRegistration registration);
        Task SaveChangesAsync();
    }
}
