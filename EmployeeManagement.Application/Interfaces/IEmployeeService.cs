using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Domain.Entities;

namespace EmployeeManagement.Application.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<EmployeeResponseDto>> GetAllAsync();

        Task<EmployeeResponseDto?> GetByIdAsync(int id);

        Task<EmployeeResponseDto> CreateAsync(EmployeeCreateDto employeeDto);

        Task<IEnumerable<EmployeeResponseDto>> SearchByDepartmentAsync(string department);

        Task UpdateAsync(int id, EmployeeUpdateDto employeeDto);

        Task DeleteAsync(int id);
    }
}