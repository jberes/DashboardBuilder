
1. **Namespace Imports**
   ```csharp
   using Reveal.Sdk;
   using Reveal.Sdk.Dom;
   using System.Text;
   using RevalSdk.Server;
   using Microsoft.Extensions.FileProviders;
   ```
   These lines import the necessary namespaces for the application. They include the Reveal SDK for creating dashboards, `System.Text` for text manipulation, and `Microsoft.Extensions.FileProviders` for file operations.

2. **Web Application Builder**
   ```csharp
   var builder = WebApplication.CreateBuilder(args);
   ```
   This line creates a new web application builder with the provided command-line arguments.

3. **Service Configuration**
   ```csharp
   builder.Services.AddControllers().AddReveal(builder => { });
   builder.Services.AddEndpointsApiExplorer();
   builder.Services.AddSwaggerGen();
   ```
   These lines add controllers, Reveal services, API explorer endpoints, and Swagger generator to the application's services.

4. **CORS Policy Configuration**
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowAll",
         builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
       );
   });
   ```
   This block adds a CORS policy named "AllowAll" that allows requests from any origin with any header and method.

5. **Application Building**
   ```csharp
   var app = builder.Build();
   ```
   This line builds the application using the configured services and settings.

6. **Development Environment Configuration**
   ```csharp
   if (app.Environment.IsDevelopment())
   {
       app.UseSwagger();
       app.UseSwaggerUI();
   }
   ```
   If the application is running in a development environment, it enables the use of Swagger and Swagger UI for API documentation.

7. **Middleware Configuration**
   ```csharp
   app.UseCors("AllowAll");
   app.UseHttpsRedirection();
   app.UseAuthorization();
   app.MapControllers();
   ```
   These lines configure the application's middleware. It enables the "AllowAll" CORS policy, HTTPS redirection, authorization, and controller mapping.

8. **Static Files Configuration**


# Middleware Documentation: UseStaticFiles

## Description
The `UseStaticFiles` middleware is a part of ASP.NET Core's built-in middleware for handling static files. It enables the application to serve static files from a specified directory.

## Usage
In the provided code snippet, `UseStaticFiles` is being used with `StaticFileOptions` to specify options for serving static files.

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});
```

## Parameters

- `FileProvider`: This parameter is of type `IFileProvider`. It is used to specify the file provider for locating the static files. In this case, a `PhysicalFileProvider` is being used to serve files from the physical path combined with the content root path of the application and the "Images" directory.

- `RequestPath`: This parameter is of type `PathString`. It is used to specify the request path for accessing the static files. In this case, the static files can be accessed with the "/Images" path in the URL.

## Why it is needed
Serving static files is a fundamental task for a web server. Static files, such as HTML, CSS, images, and JavaScript, are assets an ASP.NET Core app serves directly to clients. Some configuration is required to enable serving of these files. The `UseStaticFiles` middleware provides an easy and efficient way to serve static files in an ASP.NET Core application.
```

   ```csharp
   app.UseStaticFiles(new StaticFileOptions
   {
       FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Images")),
       RequestPath = "/Images"
   });
   ```
   This block configures the application to serve static files from the "Images" directory.

9. **Dashboard Existence Endpoint**
   ```csharp
   app.MapGet("/dashboards/{name}/exists", (string name) =>
   {
       var filePath = Path.Combine(Environment.CurrentDirectory, "Dashboards");
       return File.Exists($"{filePath}/{name}.rdash");
   });
   ```
   This block maps a GET request to check if a dashboard file exists.

11. **Dashboard Visualizations Endpoint**
   ```csharp
   app.MapGet("dashboards/visualizations", () =>
   {
       try
       {
           var allVisualizationChartInfos = new List<VisualizationChartInfo>();
           var dashboardFiles = Directory.GetFiles("Dashboards", "*.rdash");

           foreach (var filePath in dashboardFiles)
           {
               try
               {
                   var document = RdashDocument.Load(filePath);
                   foreach (var viz in document.Visualizations)
                   {
                       try
                       {
                           var vizType = viz.GetType();
                           var chartInfo = new VisualizationChartInfo
                           {
                               DashboardFileName = Path.GetFileNameWithoutExtension(filePath),
                               DashboardTitle = document.Title,
                               VizId = viz.Id,
                               VizTitle = viz.Title,
                               VizChartType = viz.ChartType.ToString(),                           
                           };
                           allVisualizationChartInfos.Add(chartInfo);
                       }
                       catch (Exception vizEx)
                       {
                           Console.WriteLine($"Error processing visualization {viz.Id} in file {filePath}: {vizEx.Message}");
                       }
                   }
               }
               catch (Exception fileEx)
               {
                   Console.WriteLine($"Error processing file {filePath}: {fileEx.Message}");
               }
           }
           return Results.Ok(allVisualizationChartInfos);
       }
       catch (Exception ex)
       {
           return Results.Problem($"An error occurred: {ex.Message}");
       }

   }).Produces<IEnumerable<VisualizationChartInfo>>(StatusCodes.Status200OK)
     .Produces(StatusCodes.Status500InternalServerError);
   ```
   This block maps a GET request to retrieve all dashboard visualizations. It also specifies the response types.

11. **Middleware Configuration**
   ```csharp
   app.UseHttpsRedirection();
   app.UseAuthorization();
   app.MapControllers();
   ```
   These lines configure the application's middleware. It enables HTTPS redirection, authorization, and controller mapping.

12. **Application Run**
   ```csharp
   app.Run();
   ```
   This line runs the application.

This breakdown should help you understand the structure and functionality of the code. You can use this markdown in your documentation. Let me know if you need further clarification on any part of the code.



# Class Documentation: VisualizationChartInfo

Namespace: RevalSdk.Server

## Description
The `VisualizationChartInfo` class is a part of the `RevalSdk.Server` namespace. It is designed to hold information about a visualization chart.

## Properties

- `DashboardFileName`: This property is of type `string`. It can be null. It holds the file name of the dashboard.

- `DashboardTitle`: This property is of type `string`. It can be null. It holds the title of the dashboard.

- `VizId`: This property is of type `string`. It can be null. It holds the unique identifier of the visualization.

- `VizTitle`: This property is of type `string`. It can be null. It holds the title of the visualization.

- `VizChartType`: This property is of type `string`. It can be null. It holds the type of the visualization chart.

## Code for the Class

```csharp
namespace RevalSdk.Server
{
    public class VisualizationChartInfo
    {
        public string? DashboardFileName { get; set; }
        public string? DashboardTitle { get; set; }
        public string? VizId { get; set; }
        public string? VizTitle { get; set; }
        public string? VizChartType { get; set; }

    }
}
```


## Usage
This class is used to store and retrieve information about a visualization chart. The properties can be accessed and modified using standard get and set methods.
