using DigitalHeritage.Application.Interfaces;
using DigitalHeritage.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DigitalHeritage.Infrastructure.Data;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {

    }

    public DbSet<Artifact> Artifacts { get; set; }
}