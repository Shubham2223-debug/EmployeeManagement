using Microsoft.AspNetCore.Authorization;
using EmployeeManagement.Application.DTOs;
using EmployeeManagement.Application.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;


namespace EmployeeManagement.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
 
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly IValidator<EmployeeCreateDto> _employeeCreateValidator;

        public EmployeeController(
     IEmployeeService employeeService,
     IValidator<EmployeeCreateDto> employeeCreateValidator)
        {
            _employeeService = employeeService;
            _employeeCreateValidator = employeeCreateValidator;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _employeeService.GetAllAsync();

            return Ok(employees);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        [HttpPost]
        public async Task<IActionResult> Create(EmployeeCreateDto employeeDto)
        {
            var validationResult =
                await _employeeCreateValidator.ValidateAsync(employeeDto);

            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            var employee = await _employeeService.CreateAsync(employeeDto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = employee.Id },
                employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, EmployeeUpdateDto employeeDto)
        {
            await _employeeService.UpdateAsync(id, employeeDto);

            return Ok("Employee updated successfully");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _employeeService.DeleteAsync(id);

            return Ok("Employee deleted successfully");
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchByDepartment(string department)
        {
            var employees = await _employeeService.SearchByDepartmentAsync(department);

            return Ok(employees);
        }
    }
}