using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.DependencyInjection;
using TaskManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace TaskManager.Tests.Infrastructure;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private SqliteConnection? _connection;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                    typeof(DbContextOptions<TaskManagerDbContext>));

            if (descriptor != null)
            { services.Remove(descriptor); }

            // Create a single shared in-memory SqliteConnection so the database
            // persists across multiple DbContext instances during tests.
            _connection ??= new SqliteConnection("DataSource=:memory:;Cache=Shared");
            _connection.Open();

            services.AddDbContext<TaskManagerDbContext>(options =>
            {
                options.UseSqlite(_connection, sqlite => sqlite.MigrationsAssembly("TaskManager.Infrastructure"));

                options.ConfigureWarnings(w =>
                    w.Ignore(RelationalEventId.PendingModelChangesWarning));
            });

            // Build provider to create DB schema once
            var sp = services.BuildServiceProvider();

            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<TaskManagerDbContext>();
            // Ensure the database schema is created for the shared connection
            db.Database.EnsureCreated();

        });
    }

}
