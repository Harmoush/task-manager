using Microsoft.AspNetCore.Mvc;
using TaskManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace TaskManager.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ILogger<TasksController> _logger;
    private readonly TaskManagerDbContext _db;

    public TasksController(ILogger<TasksController> logger, TaskManagerDbContext db)
    {
        _logger = logger;
        _db = db;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAsync() =>
        Ok(await _db.Tasks.ToListAsync());


}