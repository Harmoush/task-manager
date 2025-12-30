using System.Net.Http.Json;
using TaskManager.Api.Contracts.Tasks;
using TaskManager.Tests.Infrastructure;
using Xunit;

namespace TaskManager.Tests.Integration.Tasks;

public class CreateTaskTests : IntegrationTestBase
{
    public CreateTaskTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task CreateTask_ShouldReturnCreatedTask()
    {
        // Arrange
        await AuthenticateAsync();

        var createRequest = new
        {
            Title = "New Task",
            Description = "This is a new task",
            DueDate = DateTime.UtcNow.AddDays(7)
        };

        // Act
        var response = await Client.PostAsJsonAsync("/api/tasks", createRequest);

        // Assert
        response.EnsureSuccessStatusCode();
        var createdTask = await response.Content.ReadFromJsonAsync<TaskResponse>();

        Assert.NotNull(createdTask);
        Assert.Equal(createRequest.Title, createdTask!.Title);
        Assert.Equal(createRequest.Description, createdTask.Description);
        Assert.Equal(createRequest.DueDate, createdTask.DueDate);
        Assert.Equal(Domain.Enums.TaskStatus.New, createdTask.Status);
    }
}
