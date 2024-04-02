

# Building the .NET Core Server for the Reveal Dashboard Builder

## Prerequisites
Before proceeding, ensure that you have the following prerequisites:
- **Visual Studio**: Make sure you have Visual Studio installed on your machine.

## Steps

### Step 1: Create a New ASP.NET Core Web API Project
- Open Visual Studio.
- Click **Create a new project** on the start page.
- Select the **ASP.NET Core Web API** template.
- Provide a project name and set the location to the desired directory.
- Choose your framework version, authentication type, and Docker options.
- Click **Create**.

### Step 2: Add Reveal SDK Packages
- Right-click the solution or project in the Solution Explorer.
- Select **Manage NuGet Packages for Solution**.
- In the package manager dialog:
  - Open the **Browse** tab.
  - Select the **Infragistics (Local)** package source.
  - Install the following NuGet packages:
    - `Reveal.Sdk.AspNetCore`
    - `Reveal.Sdk.Dom` (beta version)
  - Note: If you are a trial user, you can install the `Reveal.Sdk.Web.AspNetCore.Trial` package from NuGet.org.

### Step 3: Modify `Program.cs`
- Open the `Program.cs` file in your project.
- Add the following namespace at the top:
  ```csharp
  using Reveal.Sdk;
  using Reveal.Sdk.Dom;
  ```
- Inside the `Main` method, add the call to `IMvcBuilder.AddReveal()` to the existing `builder.Services.AddControllers()` method:
  ```csharp
  builder.Services.AddControllers().AddReveal();
  ```

# Setting Up Dashboards for Reveal SDK in ASP.NET Core

### Step 1: Create the Dashboards Folder
- In your Visual Studio solution, right-click the project in the Solution Explorer.
- Select **Add -> New Folder**.
- Name the folder **Dashboards**. This folder will serve as the default location for storing your dashboard files.

### Step 2: Download and Extract Sample Dashboards
- Download the sample dashboards ZIP file from this location: [samples-dashboards.zip](https://github.com/jberes/DashboardBuilder/blob/main/samples-dashboards.zip).
- Extract the contents of the ZIP file to the newly created **Dashboards** folder.
  - You can do this by right-clicking the ZIP file and selecting an option like "Extract All" or "Extract Here."
  - Ensure that the extracted files are directly under the **Dashboards** folder (not in any subdirectories).

### Step 3: Set the "Copy if Newer" Property
To ensure that each dashboard file is correctly deployed, follow these steps:
- Open your Visual Studio project.
- In the Solution Explorer, locate the **Dashboards** folder.
- Right-click the **Dashboards** folder and select **Properties**.
- In the Properties window:
  - Set the **Build Action** to **Content** (this ensures the files are included in the build).
  - Set the **Copy to Output Directory** to **Copy if newer** (this ensures the files are copied during deployment if they have changed).

## Notes
- The Reveal SDK conventionally loads dashboards from the **Dashboards** folder. You can customize this behavior by creating a custom `IRVDashboardProvider`.
- Make sure your dashboard files (with the `.rdash` extension) are directly under the **Dashboards** folder.
- Verify that the **Copy if Newer** property is correctly set for each dashboard file.

### Step 4: Setup CORS Policy (Debugging)
While developing and debugging, you may host the server and client app on different URLs. To enable cross-origin requests (CORs) during debugging:
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

### Step 5: Middleware Configuration
```csharp
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
```
These lines configure the application's middleware. It enables the "AllowAll" CORS policy, HTTPS redirection, authorization, and controller mapping.

### Step 6: Static Files Configuration
The `UseStaticFiles` middleware is a part of ASP.NET Core's built-in middleware for handling static files. It enables the application to serve static files from a specified directory. Serving static files is a fundamental task for a web server. Static files, such as HTML, CSS, images, and JavaScript, are assets an ASP.NET Core app serves directly to clients. Some configuration is required to enable serving of these files. The `UseStaticFiles` middleware provides an easy and efficient way to serve static files in an ASP.NET Core application.

- `FileProvider`: This parameter is of type `IFileProvider`. It is used to specify the file provider for locating the static files. In this case, a `PhysicalFileProvider` is being used to serve files from the physical path combined with the content root path of the application and the "Images" directory.

- `RequestPath`: This parameter is of type `PathString`. It is used to specify the request path for accessing the static files. In this case, the static files can be accessed with the "/Images" path in the URL.

In the provided code snippet, `UseStaticFiles` is being used with `StaticFileOptions` to specify options for serving static files.

Make sure to add the using statement to enable static file operations:

```csharp
using Microsoft.Extensions.FileProviders;
```

Then add the path to the Image folder you added earlier so they can correctly be served by this .NET Core application.

```csharp
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});
```

### Step 7: Check if Dashboard Exists
The given code snippet is a route handler in a **.NET Core** application that checks whether a dashboard file exists. It exposes an HTTP endpoint that accepts a dashboard name as a parameter and verifies if the corresponding dashboard file exists on the server.

- The route is defined using `app.MapGet()`, which associates an HTTP GET request with a specific path.
- The `{name}` placeholder in the route corresponds to the dashboard name provided in the URL.

```csharp
app.MapGet("/dashboards/{name}/exists", (string name) =>
{
   var filePath = Path.Combine(Environment.CurrentDirectory, "Dashboards");
   return File.Exists($"{filePath}/{name}.rdash");});
```

1. **File Path Calculation**:
   - The `filePath` variable is constructed by combining the current working directory (`Environment.CurrentDirectory`) with the subdirectory named "Dashboards."
   - This assumes that the dashboard files are stored within the "Dashboards" directory.

2. **File Existence Check**:
   - The `File.Exists()` method is used to verify if a file with the specified name (`{name}.rdash`) exists in the calculated file path.
   - If the file exists, the method returns `true`; otherwise, it returns `false`.

### Step 8: Add the VisualizationChartInfo Class
Namespace: RevalSdk.Server

The `VisualizationChartInfo` class is a part of the `RevalSdk.Server` namespace. This class is used to store and retrieve information about a visualization chart. The properties can be accessed and modified using standard get and set methods.

#### Properties
- `DashboardFileName`: This property is of type `string`. It can be null. It holds the file name of the dashboard.
- `DashboardTitle`: This property is of type `string`. It can be null. It holds the title of the dashboard.
- `VizId`: This property is of type `string`. It can be null. It holds the unique identifier of the visualization.
- `VizTitle`: This property is of type `string`. It can be null. It holds the title of the visualization.
- `VizChartType`: This property is of type `string`. It can be null. It holds the type of the visualization chart.

#### Code for the Class
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

### Step 9: Retrieve Visualization Information from Dashboard Files
The given code snippet is part of a **.NET Core** application and serves as a route handler. Its purpose is to collect information about visualizations from dashboard files stored in a specific directory. The endpoint `/dashboards/visualizations` responds with a list of `VisualizationChartInfo` objects.

#### Route Definition

```csharp
app.MapGet("dashboards/visualizations", () =>
{
    // Implementation details...
});
```

- The route is defined using `app.MapGet()`, associating an HTTP GET request with the path `/dashboards/visualizations`.

#### File Processing

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

