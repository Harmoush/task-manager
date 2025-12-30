using System.Security.Claims;

namespace TaskManager.Infrastructure.Auth;

public static class UserExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException("User ID claim not found.");
        return Guid.Parse(userIdClaim);
    }
}
