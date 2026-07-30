namespace Messenger.Contracts.Dtos;

public record MessageDto(Guid Id, Guid ChatId, Guid SenderId, string Text, DateTime CreatedAtUtc);