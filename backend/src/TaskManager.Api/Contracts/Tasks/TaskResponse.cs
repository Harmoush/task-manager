namespace TaskManager.Api.Contracts.Tasks;

using TaskStatus = Domain.Enums.TaskStatus;

public record TaskResponse(
    Guid Id,
    string Title,
    string? Description,
    TaskStatus Status,
    Guid? AssignedUserId,
    DateTime? DueDate,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);