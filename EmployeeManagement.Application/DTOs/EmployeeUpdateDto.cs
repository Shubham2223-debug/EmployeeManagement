using System;
using System.Collections.Generic;
using System.Text;

namespace EmployeeManagement.Application.DTOs
{
    public class EmployeeUpdateDto
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Department { get; set; } = string.Empty;

        public decimal Salary { get; set; }

        public DateTime JoiningDate { get; set; }
        public bool IsActive { get; set; }
    }
}
