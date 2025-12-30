using Xunit;
using System.Net.Http.Json;
using TaskManager.Tests.Infrastructure;

namespace TaskManager.Tests.Integration;

public abstract class IntegrationTestBase : IClassFixture<CustomWebApplicationFactory>
{
    protected readonly HttpClient Client;

    protected IntegrationTestBase(CustomWebApplicationFactory factory)
    {
        Client = factory.CreateClient();
    }

    protected async Task AuthenticateAsync()
    {
        // Register a new user and obtain a JWT token
        var registerResponse = await Client.PostAsJsonAsync("/api/auth/register", new
        {
            Email = "test@test.com",
            Password = "Password123!"
        });

        if (!registerResponse.IsSuccessStatusCode)
        {
            var content = await registerResponse.Content.ReadAsStringAsync();
            throw new Exception($"Register failed: {(int)registerResponse.StatusCode} - {content}");
        }

        var loginResponse = await Client.PostAsJsonAsync("/api/auth/login", new
        {
            Email = "test@test.com",
            Password = "Password123!"
        });

        if (!loginResponse.IsSuccessStatusCode)
        {
            var content = await loginResponse.Content.ReadAsStringAsync();
            throw new Exception($"Login failed: {(int)loginResponse.StatusCode} - {content}");
        }

        var result = await loginResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", result!.Token);

    }

    protected record AuthResponse(string Token);

}
