using System;
using System.ComponentModel.DataAnnotations;

namespace DigitalHeritage.Domain.Entities;

public class Artifact
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string ImageBase64 { get; set; } = string.Empty;

    public string? GenerationSettings { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}