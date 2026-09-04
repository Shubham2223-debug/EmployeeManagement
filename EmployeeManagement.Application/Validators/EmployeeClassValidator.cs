using System;
using System.Collections.Generic;
using System.Text;
using EmployeeManagement.Application.DTOs;
using FluentValidation;

namespace EmployeeManagement.Application.Validators
{
    public class EmployeeCreateDtoValidator
        : AbstractValidator<EmployeeCreateDto>
    {
        public EmployeeCreateDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage("First name is required.")
                .MaximumLength(50);

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage("Last name is required.")
                .MaximumLength(50);

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .EmailAddress()
                .WithMessage("Please enter a valid email address.");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .WithMessage("Phone number is required.")
                .Matches(@"^[0-9]{10}$")
                .WithMessage("Phone number must contain exactly 10 digits.");

            RuleFor(x => x.Department)
                .NotEmpty()
                .WithMessage("Department is required.")
                .MaximumLength(50);

            RuleFor(x => x.Salary)
                .GreaterThan(0)
                .WithMessage("Salary must be greater than 0.");

            RuleFor(x => x.JoiningDate)
                .NotEmpty()
                .WithMessage("Joining date is required.");
        }
    }
}


