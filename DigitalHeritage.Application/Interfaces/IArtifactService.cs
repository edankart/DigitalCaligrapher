using DigitalHeritage.Application.DTOs;

namespace DigitalHeritage.Application.Interfaces;

public interface IArtifactService
{
    Task<Guid> SaveArtifactAsync(CreateArtifactDto request);
    Task<List<ArtifactDto>> GetAllArtifactsAsync();
    Task<bool> DeleteArtifactAsync(Guid id);
}