
using System.Net;
using System.Text.Json;

namespace EmployeeManagement.API.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "An unhandled exception occurred.");

                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(
            HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            int statusCode;
            string message;

            if (exception is KeyNotFoundException)
            {
                statusCode = StatusCodes.Status404NotFound;
                message = exception.Message;
            }
            else
            {
                statusCode = StatusCodes.Status500InternalServerError;
                message = "An unexpected error occurred.";
            }

            context.Response.StatusCode = statusCode;

            var response = new
            {
                statusCode = statusCode,
                message = message,
                timestamp = DateTime.UtcNow
            };

            var json = JsonSerializer.Serialize(response);

            await context.Response.WriteAsync(json);
        }
    }
}