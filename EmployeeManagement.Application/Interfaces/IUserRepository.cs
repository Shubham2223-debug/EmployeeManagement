using System;
using System.Collections.Generic;
using System.Text;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);

        Task<User?> GetByEmailAsync(string email);

        Task<User> AddAsync(User user);
    }
}
