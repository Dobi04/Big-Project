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
        Task Add(User user);
        Task SaveChangesAsync();
    }
}
