using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskManager.Domain.Entities;
using TaskManager.Infrastructure.Identity;

namespace TaskManager.Infrastructure.Persistence;

public class TaskManagerDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public TaskManagerDbContext(DbContextOptions<TaskManagerDbContext> options)
        : base(options)
    { }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<TaskItem>(entity =>
        {
            entity.ToTable("Tasks");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(200);
            entity.Property(t => t.Description)
                .HasMaxLength(1000);
            entity.Property(t => t.Status)
                .IsRequired();
            entity.Property(t => t.AssignedUserId);
            entity.Property(t => t.DueDate);
            entity.Property(t => t.CreatedAt)
                .IsRequired();
            entity.Property(t => t.UpdatedAt);
        });
    }
}