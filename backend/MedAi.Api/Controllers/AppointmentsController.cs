using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedAi.Api.Data;
using MedAi.Api.Models;

namespace MedAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly MedAiDbContext _context;

    public AppointmentsController(MedAiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
    {
        return await _context.Appointments
            .OrderBy(a => a.ScheduledTime)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Appointment>> CreateAppointment([FromBody] Appointment appointment)
    {
        appointment.ScheduledTime = appointment.ScheduledTime == default ? DateTime.UtcNow.AddHours(2) : appointment.ScheduledTime;
        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAppointments), new { id = appointment.Id }, appointment);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var appt = await _context.Appointments.FindAsync(id);
        if (appt == null) return NotFound();

        appt.Status = status;
        await _context.SaveChangesAsync();

        return Ok(appt);
    }

    [HttpGet("prescriptions")]
    public async Task<ActionResult<IEnumerable<Prescription>>> GetPrescriptions()
    {
        return await _context.Prescriptions
            .Include(p => p.Items)
            .OrderByDescending(p => p.IssuedAt)
            .ToListAsync();
    }

    [HttpPost("prescriptions")]
    public async Task<ActionResult<Prescription>> CreatePrescription([FromBody] Prescription prescription)
    {
        prescription.IssuedAt = DateTime.UtcNow;
        _context.Prescriptions.Add(prescription);
        await _context.SaveChangesAsync();

        return Ok(prescription);
    }
}
