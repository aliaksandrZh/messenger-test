public interface IChatService
{
  Task<Guid> CreateChatAsync(string name, Guid creatorUserId, CancellationToken cancellationToken = default);
  Task<Guid> AddUsersToChatAsync(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default);
  Task<List<Chat>> SearchChatsAsync(string query, CancellationToken cancellationToken = default);
  Task<List<Chat>> GetChatsForUserAsync(Guid userId, string query = "", CancellationToken cancellationToken = default);
}