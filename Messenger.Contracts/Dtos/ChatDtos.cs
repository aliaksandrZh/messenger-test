namespace Messenger.Contracts.Dtos;

public record ChatDto(Guid Id, string Name);

public record CreateChatRequest(string Name, Guid CreatorUserId);

public record InviteRequest(List<Guid> UserIds);

public record JoinRequest(Guid UserId);

public record ChatIdDto(Guid Id);