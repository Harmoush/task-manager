using Microsoft.AspNetCore.Mvc;
using TaskManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TaskManager.Api.Contracts.Tasks;
using TaskManager.Domain.Entities;
using TaskManager.Api.Contracts;

namespace TaskManager.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
[ApiVersion("1.0")]
public class TasksController : ControllerBase
{
    private readonly ILogger<TasksController> _logger;
    private readonly TaskManagerDbContext _db;

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public TasksController(ILogger<TasksController> logger, TaskManagerDbContext db)
    {
        _logger = logger;
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetAsync(
        int page = 1,
        int pageSize = 10,
        bool? isCompleted = null,
        string? search = null,
        string? sortBy = null,
        bool ascending = true)
    {
        var query = _db.Tasks
            .Where(t => !t.IsDeleted && (t.AssignedUserId == UserId || t.CreatedByUserId == UserId));

        if (isCompleted.HasValue)
        {
            query = query.Where(t => (isCompleted.Value && t.Status == TaskStatus.Completed) || (!isCompleted.Value && t.Status != TaskStatus.Completed));
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(t => t.Title.Contains(search) || t.Description!.Contains(search));
        }

        query = sortBy?.ToLower() switch
        {
            "title" => ascending ? query.OrderBy(t => t.Title) : query.OrderByDescending(t => t.Title),
            "duedate" => ascending ? query.OrderBy(t => t.DueDate) : query.OrderByDescending(t => t.DueDate),
            "createdat" => ascending ? query.OrderBy(t => t.CreatedAt) : query.OrderByDescending(t => t.CreatedAt),
            "updatedat" => ascending ? query.OrderBy(t => t.UpdatedAt) : query.OrderByDescending(t => t.UpdatedAt),
            _ => query.OrderBy(t => t.CreatedAt)
        };

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var responseItems = items.Select(t => new TaskResponse(
            t.Id,
            t.Title,
            t.Description,
            t.Status,
            t.AssignedUserId,
            t.DueDate,
            t.CreatedAt,
            t.UpdatedAt,
            t.CreatedByUserId
        ));

        return Ok(new PagedResult<TaskResponse>(responseItems.ToList(), totalCount, page, pageSize));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> GetAsync(Guid id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();
        if (task.IsDeleted || (task.AssignedUserId != UserId && task.CreatedByUserId != UserId))
            return NotFound();
        var response = new TaskResponse(
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.AssignedUserId,
            task.DueDate,
            task.CreatedAt,
            task.UpdatedAt,
            task.CreatedByUserId
        );
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateAsync(CreateTaskRequest request)
    {
        var task = new TaskItem(request.Title, request.Description, UserId, request.DueDate);

        // Assign to self as default
        task.AssignToUser(UserId);

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        var response = new TaskResponse(
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.AssignedUserId,
            task.DueDate,
            task.CreatedAt,
            task.UpdatedAt,
            task.CreatedByUserId
        );

        return CreatedAtAction("Get", new { id = task.Id }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        if (task.IsDeleted || (task.AssignedUserId != UserId && task.CreatedByUserId != UserId))
            return NotFound();

        task.Update(request.Title, request.Description, request.DueDate);

        if (request.Status.HasValue)
        {
            task.MoveTo(request.Status.Value);
        }
        if (request.AssignedUserId.HasValue)
        {
            task.AssignToUser(request.AssignedUserId.Value);
        }

        await _db.SaveChangesAsync();

        var response = new TaskResponse(
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.AssignedUserId,
            task.DueDate,
            task.CreatedAt,
            task.UpdatedAt,
            task.CreatedByUserId
        );

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteAsync(Guid id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        if (task.IsDeleted || (task.AssignedUserId != UserId && task.CreatedByUserId != UserId))
            return NotFound();

        //Soft delete
        task.MarkAsDeleted();

        await _db.SaveChangesAsync();

        return NoContent();
    }
}