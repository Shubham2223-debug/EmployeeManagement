using System;
using System.Collections.Generic;
using System.Text;
using EmployeeManagement.Application.DTOs.Auth;

namespace EmployeeManagement.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto);

        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
    }
}
    

