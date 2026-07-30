public interface IChatRepository
{
  Task<Guid> CreateChatAsync(string name, CancellationToken cancellationToken = default);
  Task<Guid> AddUsersToChatAsync(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default);
}