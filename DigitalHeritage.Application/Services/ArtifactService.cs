using DigitalHeritage.Application.DTOs;
using DigitalHeritage.Application.Interfaces;
using DigitalHeritage.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace DigitalHeritage.Application.Services;

public class ArtifactService : IArtifactService
{
    private readonly IAppDbContext _context;

    public ArtifactService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<Guid> SaveArtifactAsync(CreateArtifactDto request)
    {
        if (string.IsNullOrEmpty(request.ImageBase64))
        {
            throw new ArgumentException("Image data is empty.");
        }

        var artifact = new Artifact
        {
            Title = "My Pattern",
            ImageBase64 = request.ImageBase64,
            GenerationSettings = request.Settings,
            CreatedAt = DateTime.UtcNow
        };

        _context.Artifacts.Add(artifact);
        await _context.SaveChangesAsync();

        return artifact.Id;
    }

    public async Task<List<ArtifactDto>> GetAllArtifactsAsync()
    {
        return await _context.Artifacts
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new ArtifactDto
            {
                Id = a.Id,
                Title = a.Title,
                ImageBase64 = a.ImageBase64,
                GenerationSettings = a.GenerationSettings,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteArtifactAsync(Guid id)
    {
        var artifact = await _context.Artifacts.FindAsync(id);
        if (artifact == null) return false;

        _context.Artifacts.Remove(artifact);
        await _context.SaveChangesAsync();
        return true;
    }
}