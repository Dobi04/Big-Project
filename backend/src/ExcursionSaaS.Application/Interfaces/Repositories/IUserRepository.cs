using ExcursionSaaS.Domain.Entities;

namespace ExcursionSaaS.Application.Interfaces.Repositories;

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
