



Certainly! Below is a step-by-step guide on how to install the **Reveal SDK** packages (`Reveal.Sdk.AspNetCore` and `Reveal.Sdk.Dom`) into a **.NET Core** project using **Visual Studio**:

---

# Installing Reveal SDK Packages in a .NET Core Project

## Prerequisites

Before proceeding, ensure that you have the following prerequisites:

- **Visual Studio**: Make sure you have Visual Studio installed on your machine.

## Steps

1. **Create a New ASP.NET Core Web API Project**:
   - Open Visual Studio.
   - Click **Create a new project** on the start page.
   - Select the **ASP.NET Core Web API** template.
   - Provide a project name and set the location to the desired directory.
   - Choose your framework version, authentication type, and Docker options.
   - Click **Create**.

2. **Add Reveal SDK Packages**:
   - Right-click the solution or project in the Solution Explorer.
   - Select **Manage NuGet Packages for Solution**.
   - In the package manager dialog:
     - Open the **Browse** tab.
     - Select the **Infragistics (Local)** package source.
     - Install the following NuGet packages:
       - `Reveal.Sdk.AspNetCore`
       - `Reveal.Sdk.Dom` (beta version)
     - Note: If you are a trial user, you can install the `Reveal.Sdk.Web.AspNetCore.Trial` package from NuGet.org.

3. **Modify `Program.cs`**:
   - Open the `Program.cs` file in your project.
   - Add the following namespace at the top:
     ```csharp
     using Reveal.Sdk;
     ```
   - Inside the `Main` method, add the call to `IMvcBuilder.AddReveal()` to the existing `builder.Services.AddControllers()` method:
     ```csharp
     builder.Services.AddControllers().AddReveal();
     ```

Certainly! Let's enhance the documentation for creating the **Dashboards** folder, downloading the sample dashboards, and ensuring the **Copy if Newer** property is set correctly:

---

# Setting Up Dashboards for Reveal SDK in ASP.NET Core

## Step 1: Create the Dashboards Folder

1. In your Visual Studio solution, right-click the project in the Solution Explorer.
2. Select **Add -> New Folder**.
3. Name the folder **Dashboards**. This folder will serve as the default location for storing your dashboard files.

## Step 2: Download and Extract Sample Dashboards

1. Download the sample dashboards ZIP file from this location: [samples-dashboards.zip](https://github.com/jberes/DashboardBuilder/blob/main/samples-dashboards.zip).
2. Extract the contents of the ZIP file to the newly created **Dashboards** folder.
   - You can do this by right-clicking the ZIP file and selecting an option like "Extract All" or "Extract Here."
   - Ensure that the extracted files are directly under the **Dashboards** folder (not in any subdirectories).

## Step 3: Set the "Copy if Newer" Property

To ensure that each dashboard file is correctly deployed, follow these steps:

1. Open your Visual Studio project.
2. In the Solution Explorer, locate the **Dashboards** folder.
3. Right-click the **Dashboards** folder and select **Properties**.
4. In the Properties window:
   - Set the **Build Action** to **Content** (this ensures the files are included in the build).
   - Set the **Copy to Output Directory** to **Copy if newer** (this ensures the files are copied during deployment if they have changed).

## Notes

- The Reveal SDK conventionally loads dashboards from the **Dashboards** folder. You can customize this behavior by creating a custom `IRVDashboardProvider`.
- Make sure your dashboard files (with the `.rdash` extension) are directly under the **Dashboards** folder.
- Verify that the **Copy if Newer** property is correctly set for each dashboard file.

---



5. **Setup CORS Policy (Debugging)**:
   - While developing and debugging, you may host the server and client app on different URLs.
   - To enable cross-origin requests (CORs) during debugging:
     - Modify the `Program.cs` file:
       ```csharp
       builder.Services.AddCors(options =>
       {
           options.AddPolicy("AllowAll", builder =>
               builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
       });

       if (app.Environment.IsDevelopment())
       {
           app.UseCors("AllowAll");
       }
       ```
     - Ensure that the `UseCors` middleware is called after `UseHttpsRedirection()` and before `UseAuthorization()`.

6. **Build and Run**:
   - Build your project to ensure there are no errors.
   - Run your ASP.NET Core application.

## Additional Notes

- Customize the folder structure, dashboard conventions, and CORS policies according to your project requirements.

---

Feel free to adapt this documentation to your specific project context. If you have further questions or need additional details, feel free to ask!

Source: Conversation with Bing, 3/30/2024
(1) Setting up the Reveal SDK Server with ASP.NET | Reveal. https://help.revealbi.io/web/getting-started-server/.
(2) Configuring an ASP.NET Core Server | Reveal. https://help.revealbi.io/web/configuring-server-aspnet/.
(3) Installing the Server SDK | Reveal. https://help.revealbi.io/web/install-server-sdk/.
(4) Getting Started with Reveal SDK for ASP.NET | Reveal. https://help.revealbi.io/web/getting-started-aspnet/.
(5) undefined. https://localhost:24519.
(6) undefined. https://localhost:4200.

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
Certainly! Below is the technical documentation in Markdown format that describes the provided code snippet:

---

# Check if Dashboard File Exists

## Overview

The given code snippet is a route handler in a **.NET Core** application that checks whether a dashboard file exists. It exposes an HTTP endpoint that accepts a dashboard name as a parameter and verifies if the corresponding dashboard file exists on the server.

## Code Explanation

### Route Definition

```csharp
app.MapGet("/dashboards/{name}/exists", (string name) =>
{
    // Implementation details...
});
```

- The route is defined using `app.MapGet()`, which associates an HTTP GET request with a specific path.
- The `{name}` placeholder in the route corresponds to the dashboard name provided in the URL.

### File Existence Check

```csharp
var filePath = Path.Combine(Environment.CurrentDirectory, "Dashboards");
return File.Exists($"{filePath}/{name}.rdash");
```

1. **File Path Calculation**:
   - The `filePath` variable is constructed by combining the current working directory (`Environment.CurrentDirectory`) with the subdirectory named "Dashboards."
   - This assumes that the dashboard files are stored within the "Dashboards" directory.

2. **File Existence Check**:
   - The `File.Exists()` method is used to verify if a file with the specified name (`{name}.rdash`) exists in the calculated file path.
   - If the file exists, the method returns `true`; otherwise, it returns `false`.

## Purpose and Use Case

The purpose of this code snippet is to provide a simple API endpoint for clients to check whether a specific dashboard file exists. This functionality can be useful in scenarios such as:

- **Dynamic Dashboard Loading**: When your application dynamically loads dashboards based on user requests, you can use this route to determine if a requested dashboard exists before attempting to load it.
- **Error Handling**: If a dashboard file is missing, you can return an appropriate error response (e.g., 404 Not Found) to the client.

## Notes

- Ensure that the "Dashboards" directory exists and contains the relevant dashboard files.
- Adjust the implementation as needed to handle additional logic (e.g., authentication, authorization, error handling).

---

Feel free to customize this documentation according to your specific project requirements. If you have any further questions or need additional details, feel free to ask!

Certainly! Let's dive into the technical documentation for the provided code snippet:

---

# Retrieve Visualization Information from Dashboard Files

## Overview

The given code snippet is part of a **.NET Core** application and serves as a route handler. Its purpose is to collect information about visualizations from dashboard files stored in a specific directory. The endpoint `/dashboards/visualizations` responds with a list of `VisualizationChartInfo` objects.

## Code Explanation

### Route Definition

```csharp
app.MapGet("dashboards/visualizations", () =>
{
    // Implementation details...
});
```

- The route is defined using `app.MapGet()`, associating an HTTP GET request with the path `/dashboards/visualizations`.

### File Processing

1. **File Enumeration**:
   - The code retrieves a list of dashboard files (with the `.rdash` extension) from the "Dashboards" directory using `Directory.GetFiles()`.
   - Each file path is processed individually.

2. **Dashboard Document Loading**:
   - For each dashboard file, the code attempts to load an `RdashDocument` (presumably a custom class representing the dashboard content).
   - If successful, it proceeds to extract visualization information.

3. **Visualization Information Extraction**:
   - Within each loaded dashboard document, the code iterates through the visualizations.
   - For each visualization:
     - It captures relevant details such as:
       - `DashboardFileName`: The name of the dashboard file (without the extension).
       - `DashboardTitle`: The title of the dashboard.
       - `VizId`: The unique identifier for the visualization.
       - `VizTitle`: The title of the visualization.
       - `VizChartType`: The type of chart associated with the visualization.
     - This information is stored in a `VisualizationChartInfo` object and added to the `allVisualizationChartInfos` list.

4. **Error Handling**:
   - Exceptions are caught at different levels:
     - If loading a dashboard document fails, an error message is printed.
     - If processing a visualization within a document fails, another error message is logged.
     - If any other unexpected exception occurs, a generic error message is returned.

### Response Types

- The endpoint produces two types of responses:
  1. A successful response (HTTP status 200 OK) containing a list of `VisualizationChartInfo` objects.
  2. An error response (HTTP status 500 Internal Server Error) with an appropriate message.

## Purpose and Use Case

This code snippet is useful for scenarios where you need to:
- Dynamically collect visualization metadata from dashboard files.
- Provide an API endpoint for clients to retrieve visualization information.

## Notes

- Ensure that the "Dashboards" directory exists and contains valid dashboard files.
- Customize the error handling logic as needed for your application.

---

Feel free to adapt this documentation to your specific project context. If you have further questions or need additional details, feel free to ask!

Source: Conversation with Bing, 3/30/2024
(1) Create responses in Minimal API applications | Microsoft Learn. https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/responses?view=aspnetcore-8.0.
(2) ASP.NET MapGet Example - Dot Net Perls. https://www.dotnetperls.com/mapget-aspnet-core.
(3) AspNetCore.Docs/aspnetcore/fundamentals/routing.md at main - GitHub. https://github.com/dotnet/AspNetCore.Docs/blob/main/aspnetcore/fundamentals/routing.md.
(4) asp.net core - How can I, using a WebApplication MapGet handler, send .... https://stackoverflow.com/questions/72104777/how-can-i-using-a-webapplication-mapget-handler-send-an-image-as-an-http-respo.
(5) Parameter binding in Minimal API applications | Microsoft Learn. https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/parameter-binding?view=aspnetcore-8.0.
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
