using Messenger.Contracts.Dtos;
using Messenger.Contracts.Mapping;
using Microsoft.AspNetCore.Mvc;

namespace Messenger.Api.Controllers;

[ApiController]
[Route("api/chats")]
public class ChatsController(IChatService chatService) : ControllerBase
{
  [HttpPost]
  [ProducesResponseType(typeof(ChatIdDto), StatusCodes.Status201Created)]
  public async Task<IActionResult> Create([FromBody] CreateChatRequest request, CancellationToken cancellationToken)
  {
    var chatId = await chatService.CreateChatAsync(request.Name, request.CreatorUserId, cancellationToken);
    return CreatedAtAction(nameof(Search), null, new ChatIdDto(chatId));
  }

  [HttpGet]
  [ProducesResponseType(typeof(IReadOnlyList<ChatDto>), StatusCodes.Status200OK)]
  public async Task<IActionResult> Search([FromQuery] string? query, CancellationToken cancellationToken)
  {
    var chats = await chatService.SearchChatsAsync(query ?? string.Empty, cancellationToken);
    return Ok(ContractMapper.ToDtoList(chats));
  }

  [HttpPost("{id:guid}/participants")]
  [ProducesResponseType(StatusCodes.Status200OK)]
  public async Task<IActionResult> Invite(Guid id, [FromBody] InviteRequest request, CancellationToken cancellationToken)
  {
    await chatService.AddUsersToChatAsync(id, request.UserIds, cancellationToken);
    return Ok();
  }

  [HttpPost("{id:guid}/join")]
  [ProducesResponseType(StatusCodes.Status200OK)]
  public async Task<IActionResult> Join(Guid id, [FromBody] JoinRequest request, CancellationToken cancellationToken)
  {
    await chatService.AddUsersToChatAsync(id, [request.UserId], cancellationToken);
    return Ok();
  }

  [HttpGet("user/{userId:guid}")]
  [ProducesResponseType(typeof(IReadOnlyList<ChatDto>), StatusCodes.Status200OK)]
  public async Task<IActionResult> GetForUser(Guid userId, [FromQuery] string? query, CancellationToken cancellationToken)
  {
    var chats = await chatService.GetChatsForUserAsync(userId, query ?? string.Empty, cancellationToken);
    return Ok(ContractMapper.ToDtoList(chats));
  }
}