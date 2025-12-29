using Microsoft.AspNetCore.Mvc;
using TaskManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TaskManager.Api.Contracts.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/tasks")]
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
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetAsync() =>
        Ok(await _db.Tasks.Select(t => new TaskResponse(
            t.Id,
            t.Title,
            t.Description,
            t.Status,
            t.AssignedUserId,
            t.DueDate,
            t.CreatedAt,
            t.UpdatedAt
        )).ToListAsync());

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> GetAsync(Guid id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();
        var response = new TaskResponse(
            task.Id,
            task.Title,
            task.Description,
            task.Status,
            task.AssignedUserId,
            task.DueDate,
            task.CreatedAt,
            task.UpdatedAt
        );
        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateAsync(CreateTaskRequest request)
    {
        var task = new TaskItem(request.Title, request.Description, request.DueDate);
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
            task.UpdatedAt
        );

        return CreatedAtAction("Get", new { id = task.Id }, response);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskResponse>> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
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
            task.UpdatedAt
        );

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteAsync(Guid id)
    {
        var task = await _db.Tasks.FindAsync(id);
        if (task == null)
            return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}