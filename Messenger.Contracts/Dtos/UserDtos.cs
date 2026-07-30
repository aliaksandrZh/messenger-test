namespace Messenger.Contracts.Dtos;

public record UserDto(Guid Id, string Name, string Email);

public record CreateUserRequest(string Name, string Email);

public record AddContactRequest(Guid ContactId);