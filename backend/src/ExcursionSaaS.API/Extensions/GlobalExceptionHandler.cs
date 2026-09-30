using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics;
using MySqlConnector;

namespace ExcursionSaaS.API.Extensions;

public sealed class GlobalExceptionHandler : IExceptionHandler
{
    #region Constructor
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }
    #endregion

    #region Exception Handling
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "An unhandled exception occurred while processing the request.");

        var isConflict = exception is DbUpdateException dbUpdateException
            && IsUniqueConstraintViolation(dbUpdateException);

        httpContext.Response.StatusCode = isConflict
            ? StatusCodes.Status409Conflict
            : StatusCodes.Status500InternalServerError;

        await httpContext.Response.WriteAsJsonAsync(new
        {
            message = isConflict
                ? "The request conflicts with existing data."
                : "An unexpected error occurred."
        }, cancellationToken);

        return true;
    }
    #endregion

    #region Helpers
    public static bool IsUniqueConstraintViolation(DbUpdateException exception)
    {
        for (Exception? current = exception; current != null; current = current.InnerException)
        {
            if (current is MySqlException { Number: 1062 })
                return true;
        }

        return false;
    }
    #endregion
}