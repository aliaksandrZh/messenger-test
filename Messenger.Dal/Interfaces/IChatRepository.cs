public interface IChatRepository
{
  Task<Guid> CreateChatAsync(CancellationToken cancellationToken = default);
  Task<Guid> AddUsersToChatAsync(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default);
}