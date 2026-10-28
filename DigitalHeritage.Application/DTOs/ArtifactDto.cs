namespace DigitalHeritage.Application.DTOs;

public class ArtifactDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageBase64 { get; set; } = string.Empty;
    public string? GenerationSettings { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateArtifactDto
{
    public string ImageBase64 { get; set; } = string.Empty;
    public string Settings { get; set; } = string.Empty;
}