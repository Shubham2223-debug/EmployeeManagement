using System;
using System.Collections.Generic;
using System.Text;

namespace EmployeeManagement.Application.DTOs.Auth
{
 
         public class LoginResponseDto
        {
            public string Token { get; set; } = string.Empty;

            public string Username { get; set; } = string.Empty;

            public string Role { get; set; } = string.Empty;
        }
    }


