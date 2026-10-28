using DigitalHeritage.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace DigitalHeritage.Application.Interfaces;

public interface IAppDbContext
{
    DbSet<Artifact> Artifacts { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}