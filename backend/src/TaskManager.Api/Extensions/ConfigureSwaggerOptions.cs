using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TaskManager.Api.Extensions;

public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
{
    private readonly IApiVersionDescriptionProvider _provider;

    public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider)
    {
        _provider = provider;
    }

    public void Configure(SwaggerGenOptions options)
    {
        foreach (var desc in _provider.ApiVersionDescriptions)
        {
            options.SwaggerDoc(desc.GroupName, new OpenApiInfo
            {
                Title = $"Task Manager API {desc.ApiVersion}",
                Version = desc.ApiVersion.ToString()
            });
        }

        // **Define the Bearer JWT scheme**
        options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = "JWT Authorization Header using Bearer scheme",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT"
        });

        // **Use the delegate overload required in Swashbuckle 10.x**
        options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
        {
            // Use the scheme ID (same as AddSecurityDefinition name)
            [new OpenApiSecuritySchemeReference("Bearer", document)] = new List<string>()
        });
    }
}