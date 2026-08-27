using Microsoft.EntityFrameworkCore;
using MedAi.Api.Models;

namespace MedAi.Api.Data;

public class MedAiDbContext : DbContext
{
    public MedAiDbContext(DbContextOptions<MedAiDbContext> options) : base(options)
    {
    }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<VitalSign> VitalSigns => Set<VitalSign>();
    public DbSet<MedicalScan> MedicalScans => Set<MedicalScan>();
    public DbSet<ScanAnomaly> ScanAnomalies => Set<ScanAnomaly>();
    public DbSet<DiagnosticRecord> DiagnosticRecords => Set<DiagnosticRecord>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Prescription> Prescriptions => Set<Prescription>();
    public DbSet<PrescriptionItem> PrescriptionItems => Set<PrescriptionItem>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.VitalSigns)
            .WithOne()
            .HasForeignKey(v => v.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.MedicalScans)
            .WithOne()
            .HasForeignKey(s => s.PatientId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Patient>()
            .HasMany(p => p.DiagnosticHistory)
            .WithOne()
            .HasForeignKey(d => d.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MedicalScan>()
            .HasMany(s => s.Anomalies)
            .WithOne()
            .HasForeignKey(a => a.MedicalScanId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Prescription>()
            .HasMany(p => p.Items)
            .WithOne()
            .HasForeignKey(i => i.PrescriptionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
