using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using EmployeeManagement.Application.DTOs.Auth;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;


namespace EmployeeManagement.Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;

        private readonly IConfiguration _configuration;

        public AuthService(
            IUserRepository userRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(
                registerDto.Password);

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                Role = "User",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };


            // We'll save this user to SQL Server in the next step.
            await _userRepository.AddAsync(user);

            return new LoginResponseDto
            {
                Username = user.Username,
                Role = user.Role,
                Token = ""
            };
            }
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Role, user.Role)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["Jwt:Key"]!));

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository
                .GetByUsernameAsync(loginDto.Username);

            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid username or password.");
            }

            if (!BCrypt.Net.BCrypt.Verify(
                loginDto.Password,
                user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid username or password.");
            }

            var token = GenerateJwtToken(user);

            return new LoginResponseDto
            {
                Username = user.Username,
                Role = user.Role,
                Token = token
            };
        }
    }
    }

        
    
