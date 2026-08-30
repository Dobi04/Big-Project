using ExcursionSaaS.Application.DTOs.AuthDTOs;
using ExcursionSaaS.Application.DTOs.EmailVerificationDTOs;
using ExcursionSaaS.Application.Interfaces;
using ExcursionSaaS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace ExcursionSaaS.Application.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IEmailSender _emailSender;
        private const int VerificationCodeValidityMinutes = 5;

        public AuthServices(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator, IPasswordHasher passwordHasher, IEmailSender emailSender)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _passwordHasher = passwordHasher;
            _emailSender = emailSender;
        }

        public async Task<AuthResponceDTO> LoginAsync(LogInDTO dto)
        {
            var user = await _userRepository.FindByUsernameAsync(dto.Username);
            if (user == null)
                throw new UnauthorizedAccessException("Wrong username or password");

            var isValidPassword = _passwordHasher.Verify(dto.Password, user.PasswordHash);
            if (!isValidPassword)
                throw new UnauthorizedAccessException("Wrong username or password");

            if (!user.isEmailVerified)
                throw new UnauthorizedAccessException("Emain is now verified, pleace verify your email before going in");

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponceDTO
            {
                Token = token,
                Username = user.Username,
                Role = user.Role.ToString(),
            }
            ;
        }

        public async Task<MessageResponseDTO> RegisterAsync(RegistrationDTO dto)
        {
            var existingUsername = await _userRepository.FindByUsernameAsync(dto.Username);
            if (existingUsername != null)
                throw new InvalidOperationException("Username already exists");
            var existingEmail = await _userRepository.FindByEmailAsync(dto.Email);
            if (existingEmail != null)
                throw new InvalidOperationException("Email already exists");

            var code = GenerateVerificationCode();

            var newUser = new User
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = _passwordHasher.Hash(dto.Password),
                isEmailVerified = false,
                EmailVerificationCode = code,
                EmailVerificationCodeExpiry = DateTime.UtcNow.AddMinutes(VerificationCodeValidityMinutes)
            };

            await _userRepository.Add(newUser);
            await _userRepository.SaveChangesAsync();

            await _emailSender.SendEmailAsync(
                newUser.Email,
                "Verifikacija naloga",
                $"<p>Zdravo {newUser.Name},</p><p>Tvoj verifikacioni kod je: <b>{code}</b></p>" +
                $"<p>Kod važi {VerificationCodeValidityMinutes} minuta.</p>"
                );

            return new MessageResponseDTO
            {
                Message = "Registration successful. Please check your email for the verification code."
            };
        }

        private static string GenerateVerificationCode()
        {
            var number = RandomNumberGenerator.GetInt32(0, 1_000_000);
            return number.ToString("D6");
        }

        public async Task<MessageResponseDTO> ResendVerificationCodeAsync(ResendVerificationCodeDTO dto)
        {
            var user = await _userRepository.FindByEmailAsync(dto.Email);
            if (user == null || user.isEmailVerified)
            {
                return new MessageResponseDTO
                {
                    Message = "A new code has been sent."
                };
            }

            var code = GenerateVerificationCode();
            user.EmailVerificationCode = code;
            user.EmailVerificationCodeExpiry = DateTime.UtcNow.AddMinutes(VerificationCodeValidityMinutes);

            await _userRepository.SaveChangesAsync();
            
            await _emailSender.SendEmailAsync(
                user.Email,
                "Verifikacija naloga",
                $"<p>Tvoj novi verifikacioni kod je: <b>{code}</b></p>" +
                $"<p>Kod važi {VerificationCodeValidityMinutes} minuta.</p>");

            return new MessageResponseDTO
            {
                Message = "If the email exists, a new code has been sent."
            };
        }

        public async Task<AuthResponceDTO> VerifyEmailAsync(VerifyEmailDto dto)
        {
            var user = await _userRepository.FindByEmailAsync(dto.Email);
            if (user == null)
                throw new InvalidOperationException("Invalid email or verification code");
            
            if (user.isEmailVerified)
                throw new InvalidOperationException("Email already verified");

            if (user.EmailVerificationCode == null
                || user.EmailVerificationCodeExpiry == null
                || user.EmailVerificationCodeExpiry < DateTime.UtcNow)
                throw new InvalidOperationException("Verification code has expired pleace request a new one");

            if (user.EmailVerificationCode != dto.Code)
                throw new InvalidOperationException("Invalid email or verification code");

            user.isEmailVerified = true;
            user.EmailVerificationCode = null;
            user.EmailVerificationCodeExpiry = null;

            await _userRepository.SaveChangesAsync();

            var token = _jwtTokenGenerator.GenerateToken(user);

            return new AuthResponceDTO
            {
                Token = token,
                Username = user.Username,
                Role = user.Role.ToString()
            };
        }
    }
}
