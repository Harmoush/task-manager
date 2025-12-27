# Task Management System

## Tech Stack

- .NET 10 Web API
- Angular 20 + Tailwind
- SQL Server 2022 (Docker)
- Clean Architecture (Modular Monolith)

## Architecture

This solution follows Clean Architecture with clear separation of concerns:

- Domain: business rules
- Application: use cases (CQRS)
- Infrastructure: EF Core, Identity
- API: HTTP, security, observability

## Local Development

```bash
docker compose up -d
dotnet run --project backend/src/TaskManager.Api
```
