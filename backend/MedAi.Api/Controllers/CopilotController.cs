using Microsoft.AspNetCore.Mvc;
using MedAi.Api.Data;
using MedAi.Api.Models;
using MedAi.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace MedAi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CopilotController : ControllerBase
{
    private readonly IAiCopilotService _copilotService;
    private readonly MedAiDbContext _context;

    public CopilotController(IAiCopilotService copilotService, MedAiDbContext context)
    {
        _copilotService = copilotService;
        _context = context;
    }

    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<ChatMessage>>> GetChatHistory([FromQuery] string sessionId = "default-session")
    {
        var messages = await _context.ChatMessages
            .Where(m => m.SessionId == sessionId)
            .OrderBy(m => m.Timestamp)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost("chat")]
    public async Task<ActionResult<ChatResponse>> SendChatMessage([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { message = "Message cannot be empty." });
        }

        // Save user message
        var userMsg = new ChatMessage
        {
            SessionId = request.SessionId,
            Sender = "user",
            Text = request.Message,
            Timestamp = DateTime.UtcNow
        };
        _context.ChatMessages.Add(userMsg);

        // Generate AI response
        var aiResponse = await _copilotService.GenerateResponseAsync(request);

        // Save AI message
        var aiMsg = new ChatMessage
        {
            SessionId = request.SessionId,
            Sender = "ai",
            Text = aiResponse.Reply,
            Timestamp = DateTime.UtcNow.AddSeconds(1),
            SuggestedActions = aiResponse.SuggestedFollowUps,
            ClinicalCitation = aiResponse.MedicalReferences.FirstOrDefault()
        };
        _context.ChatMessages.Add(aiMsg);

        await _context.SaveChangesAsync();

        return Ok(aiResponse);
    }
}
