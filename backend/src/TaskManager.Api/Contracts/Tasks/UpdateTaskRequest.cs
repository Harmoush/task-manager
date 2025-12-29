namespace TaskManager.Api.Contracts.Tasks;

using TaskStatus = Domain.Enums.TaskStatus;

public record UpdateTaskRequest(
    string? Title = null,
    string? Description = null,
    DateTime? DueDate = null,
    Guid? AssignedUserId = null,
    TaskStatus? Status = null
);