using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedAi.Api.Data;
using MedAi.Api.Models;

namespace MedAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PatientsController : ControllerBase
{
    private readonly MedAiDbContext _context;

    public PatientsController(MedAiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Patient>>> GetPatients([FromQuery] string? search, [FromQuery] string? condition, [FromQuery] string? triage)
    {
        var query = _context.Patients
            .Include(p => p.VitalSigns.OrderByDescending(v => v.RecordedAt).Take(5))
            .Include(p => p.MedicalScans)
            .Include(p => p.DiagnosticHistory)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.FullName.Contains(search) || p.PrimaryDiagnosis.Contains(search) || p.RoomNumber.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(condition) && condition != "All")
        {
            query = query.Where(p => p.Condition == condition);
        }

        if (!string.IsNullOrWhiteSpace(triage) && triage != "All")
        {
            query = query.Where(p => p.TriageLevel == triage);
        }

        return await query.OrderByDescending(p => p.AdmittedDate).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Patient>> GetPatient(int id)
    {
        var patient = await _context.Patients
            .Include(p => p.VitalSigns.OrderByDescending(v => v.RecordedAt))
            .Include(p => p.MedicalScans).ThenInclude(s => s.Anomalies)
            .Include(p => p.DiagnosticHistory.OrderByDescending(d => d.AnalyzedAt))
            .FirstOrDefaultAsync(p => p.Id == id);

        if (patient == null)
        {
            return NotFound(new { message = $"Patient with ID {id} not found." });
        }

        return patient;
    }

    [HttpPost]
    public async Task<ActionResult<Patient>> CreatePatient(Patient patient)
    {
        patient.AdmittedDate = DateTime.UtcNow;
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatient(int id, Patient patient)
    {
        if (id != patient.Id)
        {
            return BadRequest(new { message = "ID mismatch." });
        }

        _context.Entry(patient).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Patients.Any(e => e.Id == id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    [HttpPost("{id}/vitals")]
    public async Task<ActionResult<VitalSign>> AddVitalSign(int id, VitalSign vital)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
        {
            return NotFound(new { message = "Patient not found." });
        }

        vital.PatientId = id;
        vital.RecordedAt = DateTime.UtcNow;
        _context.VitalSigns.Add(vital);
        await _context.SaveChangesAsync();

        return Ok(vital);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePatient(int id)
    {
        var patient = await _context.Patients.FindAsync(id);
        if (patient == null)
        {
            return NotFound();
        }

        _context.Patients.Remove(patient);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
