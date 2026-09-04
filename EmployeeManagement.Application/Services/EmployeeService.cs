using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using EmployeeManagement.Domain.Entities;
    using Microsoft.Extensions.Logging;

namespace EmployeeManagement.Application.Services
{
    public class EmployeeService : IEmployeeService
    {

        private readonly IEmployeeRepository _employeeRepository;
        private readonly ILogger<EmployeeService> _logger;

        public EmployeeService(
    IEmployeeRepository employeeRepository,
    ILogger<EmployeeService> logger)
        {
            _employeeRepository = employeeRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<EmployeeResponseDto>> GetAllAsync()
        {
            _logger.LogInformation("Fetching all employees.");
            var employees = await _employeeRepository.GetAllAsync();

            return employees.Select(e => new EmployeeResponseDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                PhoneNumber = e.PhoneNumber,
                Department = e.Department,
                Salary = e.Salary,
                JoiningDate = e.JoiningDate,
                IsActive = e.IsActive
            });
        }

        public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
        {
            _logger.LogInformation(
        "Fetching employee with ID {Id}.",
        id);
            var employee = await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
            {
                _logger.LogWarning(
                "Employee with ID {Id} was not found.",
                id);

                return null;

            }

            return new EmployeeResponseDto 
            {
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                Email = employee.Email,
                PhoneNumber = employee.PhoneNumber,
                Department = employee.Department,
                Salary = employee.Salary,
                JoiningDate = employee.JoiningDate,
                IsActive = employee.IsActive
            };
        }

        public async Task<EmployeeResponseDto> CreateAsync(
            EmployeeCreateDto employeeDto)
        {
            _logger.LogInformation(
                "Creating employee with email {Email}.",
                employeeDto.Email);
            var employee = new Employee
            {
                FirstName = employeeDto.FirstName,
                LastName = employeeDto.LastName,
                Email = employeeDto.Email,
                PhoneNumber = employeeDto.PhoneNumber,
                Department = employeeDto.Department,
                Salary = employeeDto.Salary,
                JoiningDate = employeeDto.JoiningDate,
                IsActive = true

            };

            var createdEmployee =
                await _employeeRepository.AddAsync(employee);

            return new EmployeeResponseDto
            {
                Id = createdEmployee.Id,
                FirstName = createdEmployee.FirstName,
                LastName = createdEmployee.LastName,
                Email = createdEmployee.Email,
                PhoneNumber = createdEmployee.PhoneNumber,
                Department = createdEmployee.Department,
                Salary = createdEmployee.Salary,
                JoiningDate = createdEmployee.JoiningDate,
                IsActive = createdEmployee.IsActive
            };
        }

        public async Task UpdateAsync(
            int id,
            EmployeeUpdateDto employeeDto)
        {
            _logger.LogInformation(
       "Updating employee with ID {Id}.",
       id);
            var employee = await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
                throw new KeyNotFoundException(
                    $"Employee with ID {id} not found.");

            employee.FirstName = employeeDto.FirstName;
            employee.LastName = employeeDto.LastName;
            employee.Email = employeeDto.Email;
            employee.PhoneNumber = employeeDto.PhoneNumber;
            employee.Department = employeeDto.Department;
            employee.Salary = employeeDto.Salary;
            employee.JoiningDate = employeeDto.JoiningDate;
            employee.IsActive = employeeDto.IsActive;

            await _employeeRepository.UpdateAsync(employee);
        }

        public async Task DeleteAsync(int id)
        {
            _logger.LogInformation(
        "Deleting employee with ID {Id}.",
        id);
            var employee = await _employeeRepository.GetByIdAsync(id);

            if (employee == null)
                throw new KeyNotFoundException(
                    $"Employee with ID {id} not found.");

            await _employeeRepository.DeleteAsync(id);
        }
        public async Task<IEnumerable<EmployeeResponseDto>> SearchByDepartmentAsync(string department)
        {
            _logger.LogInformation("Searching employees by department: {Department}", department);

            var employees = await _employeeRepository.SearchByDepartmentAsync(department);

            return employees.Select(e => new EmployeeResponseDto
            {
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                Email = e.Email,
                PhoneNumber = e.PhoneNumber,
                Department = e.Department,
                Salary = e.Salary,
                JoiningDate = e.JoiningDate,
                IsActive = e.IsActive
            });
        }
    }
}