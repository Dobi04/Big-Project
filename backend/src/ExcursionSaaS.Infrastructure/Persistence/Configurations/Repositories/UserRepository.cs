using ExcursionSaaS.Application.Interfaces;
using ExcursionSaaS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _appDbContext;

        public UserRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public Task Add(User user) => _appDbContext.Users.AddAsync(user).AsTask();

        public async Task<User?> FindByEmailAsync(string email) => await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

        public async Task<User?> FindByUsernameAsync(string username) => await _appDbContext.Users.FirstOrDefaultAsync(u => u.Username == username);

        public async Task SaveChangesAsync() => await _appDbContext.SaveChangesAsync();
    }
}
