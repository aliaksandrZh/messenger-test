using Messenger.Contracts.Dtos;
using Messenger.Contracts.Mapping;
using Microsoft.AspNetCore.Mvc;

namespace Messenger.Api.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(IUserService userService) : ControllerBase
{
  [HttpPost]
  [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
  public async Task<IActionResult> Create([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
  {
    var user = await userService.CreateUserAsync(request.Name, request.Email, cancellationToken);
    var dto = ContractMapper.ToDto(user);
    return CreatedAtAction(nameof(Get), new { id = dto.Id }, dto);
  }

  [HttpGet("{id:guid}")]
  [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Get(Guid id, CancellationToken cancellationToken)
  {
    try
    {
      var user = await userService.GetUserAsync(id, cancellationToken);
      return Ok(ContractMapper.ToDto(user));
    }
    catch (KeyNotFoundException)
    {
      return NotFound();
    }
  }

  [HttpGet]
  [ProducesResponseType(typeof(IReadOnlyList<UserDto>), StatusCodes.Status200OK)]
  public async Task<IActionResult> Search([FromQuery] string? query, CancellationToken cancellationToken)
  {
    var users = await userService.SearchUsersAsync(query ?? string.Empty, cancellationToken);
    return Ok(ContractMapper.ToDtoList(users));
  }

  [HttpPost("{id:guid}/contacts")]
  [ProducesResponseType(StatusCodes.Status200OK)]
  public async Task<IActionResult> AddContact(Guid id, [FromBody] AddContactRequest request, CancellationToken cancellationToken)
  {
    await userService.SaveContactAsync(id, request.ContactId, cancellationToken);
    return Ok();
  }

  [HttpGet("{id:guid}/contacts")]
  [ProducesResponseType(typeof(IReadOnlyList<UserDto>), StatusCodes.Status200OK)]
  public async Task<IActionResult> GetContacts(Guid id, CancellationToken cancellationToken)
  {
    var contacts = await userService.GetContactsAsync(id, cancellationToken);
    return Ok(ContractMapper.ToDtoList(contacts));
  }
}