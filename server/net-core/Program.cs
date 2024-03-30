using Reveal.Sdk;
using Reveal.Sdk.Dom;
using RevalSdk.Server;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers().AddReveal(builder => { });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
      builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    );
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});

app.MapGet("/dashboards/{name}/exists", (string name) =>
{
    var filePath = Path.Combine(Environment.CurrentDirectory, "Dashboards");
    return File.Exists($"{filePath}/{name}.rdash");
});

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
                    //    var vizType = viz.GetType();
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

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();