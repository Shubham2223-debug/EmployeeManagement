using System;
using System.Collections.Generic;
using System.Text;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Interfaces
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync();

        Task<IEnumerable<Employee>> SearchByDepartmentAsync(string department);

        Task<Employee?> GetByIdAsync(int id);

        Task<Employee> AddAsync(Employee employee);

        Task UpdateAsync(Employee employee);

        Task DeleteAsync(int id);
    }
}   


