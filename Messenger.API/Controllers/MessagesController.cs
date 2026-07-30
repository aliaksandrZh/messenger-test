using Messenger.Contracts.Dtos;
using Messenger.Contracts.Mapping;
using Microsoft.AspNetCore.Mvc;

namespace Messenger.Api.Controllers;

[ApiController]
[Route("api/messages")]
public class MessagesController(IMessageService messageService) : ControllerBase
{
  [HttpGet("{chatId:guid}")]
  [ProducesResponseType(typeof(IReadOnlyList<MessageDto>), StatusCodes.Status200OK)]
  public async Task<IActionResult> GetByChat(Guid chatId, CancellationToken cancellationToken)
  {
    var messages = await messageService.LoadMessagesAsync(chatId, cancellationToken);
    return Ok(ContractMapper.ToDtoList(messages));
  }
}