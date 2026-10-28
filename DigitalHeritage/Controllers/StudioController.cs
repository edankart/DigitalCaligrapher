using Microsoft.AspNetCore.Mvc;
using DigitalHeritage.Application.DTOs;
using DigitalHeritage.Application.Interfaces;

namespace DigitalHeritage.Web.Controllers;

public class StudioController : Controller
{
    // We inject the service from the Application layer, not the DbContext!
    private readonly IArtifactService _artifactService;

    public StudioController(IArtifactService artifactService)
    {
        _artifactService = artifactService;
    }

    // GET: /Studio
    public IActionResult Index()
    {
        return View();
    }

    // GET: /Studio/Gallery
    // Displays all saved artifacts
    public async Task<IActionResult> Gallery()
    {
        // Fetch data via the service layer
        var artifacts = await _artifactService.GetAllArtifactsAsync();
        return View(artifacts);
    }

    // POST: /Studio/Save
    [HttpPost]
    public async Task<IActionResult> Save([FromBody] ArtifactRequest request)
    {
        if (string.IsNullOrEmpty(request.ImageBase64))
        {
            return BadRequest("Image data is empty.");
        }

        // Map the request to a DTO for the Application layer
        var dto = new CreateArtifactDto
        {
            ImageBase64 = request.ImageBase64,
            Settings = request.Settings
        };

        // Call the service to save the artifact
        var id = await _artifactService.SaveArtifactAsync(dto);

        return Ok(new { id });
    }

    // POST: /Studio/Delete/{id}
    [HttpPost]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _artifactService.DeleteArtifactAsync(id);

        if (!success) return NotFound();

        return Ok();
    }
}

// DTO for receiving data from the frontend
public class ArtifactRequest
{
    public string ImageBase64 { get; set; } = string.Empty;
    public string Settings { get; set; } = string.Empty;
}