using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Text;
using System.Text.Json.Serialization;
using TaskManager.Api.Extensions;
using TaskManager.Api.Middleware;
using TaskManager.Api.Validation;
using TaskManager.Infrastructure.Identity;
using TaskManager.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// ---------------------
// Configuration    
// ---------------------
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// ---------------------
// API Versioning
// ---------------------
builder.Services.AddApiVersioning(options =>
{
    // Default version if client does not specify
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;

    // Report supported/deprecated versions in response headers
    options.ReportApiVersions = true;

    // HEADER versioning
    options.ApiVersionReader = new HeaderApiVersionReader("x-api-version");

});

// Required to generate versioned Swagger docs
builder.Services.AddVersionedApiExplorer(options =>
{
    options.GroupNameFormat = "'v'VVV"; // e.g., v1
    options.SubstituteApiVersionInUrl = false; // We are using header versioning
});


// ---------------------
// Database + Identity
// ---------------------
if (builder.Environment.IsEnvironment("Testing"))
{
    // Use SQLite in-memory for integration tests
    builder.Services.AddDbContext<TaskManagerDbContext>(options =>
    {
        options.UseSqlite(
            "DataSource=:memory:",
            sqlite => sqlite.MigrationsAssembly("TaskManager.Infrastructure"));
    });
}
else
{
    builder.Services.AddDbContext<TaskManagerDbContext>(options =>
    {
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            sql => sql.MigrationsAssembly("TaskManager.Infrastructure"));
    });
}

builder.Services
    .AddIdentityCore<ApplicationUser>()
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<TaskManagerDbContext>();

// ---------------------
// JWT Authentication
// ---------------------
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

// ---------------------
// Controllers
// ---------------------
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter()
    );
});

// ---------------------
// Swagger / OpenAPI 10.x JWT Setup
// ---------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();

// ---------------------
// Fluent Validation
// ---------------------
builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddValidatorsFromAssemblyContaining<CreateTaskValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UpdateTaskValidator>();

var app = builder.Build();

// ---------------------
// Middleware
// ---------------------
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Manager API v1"));

app.UseMiddleware<GlobalExceptionMiddleware>();

// Only for local development
// To-Do Remove later
app.UseCors(x =>
    x.AllowAnyOrigin()
     .AllowAnyHeader()
     .AllowAnyMethod());

app.Use(async (ctx, next) =>
{
    Console.WriteLine($"Incoming: {ctx.Request.Method} {ctx.Request.Path}");
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
// Make the implicit Program class public for integration tests
public partial class Program { }
