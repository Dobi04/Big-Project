using ExcursionSaaS.Application.DTOs;
using ExcursionSaaS.Application.Interfaces;
using ExcursionSaaS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IPasswordHasher _passwordHasher;

        public AuthServices(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator, IPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _passwordHasher = passwordHasher;
        }
        public async Task<AuthResponceDTO> LoginAsync(LogInDTO dto)
        {
            var user = await _userRepository.FindByUsernameAsync(dto.Username);
            if (user == null)
                throw new UnauthorizedAccessException("Wrong username or password");

            var isValidPassword = _passwordHasher.Verify(dto.Password, user.PasswordHash);
            if (!isValidPassword)
                throw new UnauthorizedAccessException("Wrong username or password");

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponceDTO
            {
                Token = token,
                Username = user.Username,
                Role = user.Role.ToString(),
            }
            ;
        }

        public async Task<AuthResponceDTO> RegisterAsync(RegistrationDTO dto)
        {
            var existingUsername = await _userRepository.FindByUsernameAsync(dto.Username);
            if (existingUsername != null)
                throw new InvalidOperationException("Username already exists");
            var existingEmail = await _userRepository.FindByEmailAsync(dto.Email);
            if (existingEmail != null)
                throw new InvalidOperationException("Email already exists");

            var newUser = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = _passwordHasher.Hash(dto.Password),
            };

            await _userRepository.Add(newUser);
            await _userRepository.SaveChangesAsync();

            return new AuthResponceDTO
            {
                Token = _jwtTokenGenerator.GenerateToken(newUser),
                Username = newUser.Username,
                Role = newUser.Role.ToString(),
            };
        }
    }
}
