using TaskManager.Domain.Common;
using TaskStatus = TaskManager.Domain.Enums.TaskStatus;

namespace TaskManager.Domain.Entities;

public class TaskItem : BaseEntity
{
    public string Title { get; private set; } = default!;
    public string? Description { get; private set; }
    public TaskStatus Status { get; private set; }
    public Guid? CreatedByUserId { get; private set; }
    public Guid? AssignedUserId { get; private set; }
    public DateTime? DueDate { get; private set; }

    public TaskItem() { }

    public TaskItem(string title, string? description, Guid userId, DateTime? dueDate = null)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
        Status = TaskStatus.New;
        CreatedByUserId = userId;
    }

    public void Update(string? title, string? description, DateTime? dueDate)
    {
        Title = string.IsNullOrWhiteSpace(title) ? Title : title;
        Description = description ?? Description;
        DueDate = dueDate ?? DueDate;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MoveTo(TaskStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AssignToUser(Guid userId)
    {
        AssignedUserId = userId;
        UpdatedAt = DateTime.UtcNow;
    }


}