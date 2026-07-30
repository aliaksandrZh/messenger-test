public class ChatService(IChatRepository chatRepository) : IChatService
{
  public async Task<Guid> CreateChatAsync(string name, Guid creatorUserId, CancellationToken cancellationToken = default)
  {
    ChatValidator.EnsureChatName(name);
    UserValidator.EnsureUserId(creatorUserId);
    return await chatRepository.CreateChatAsync(name, creatorUserId, cancellationToken);
  }

  public async Task<Guid> AddUsersToChatAsync(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default)
  {
    ChatValidator.EnsureChatId(chatId);
    ChatValidator.EnsureUserIds(userIds);
    return await chatRepository.AddUsersToChatAsync(chatId, userIds, cancellationToken);
  }

  public async Task<List<Chat>> SearchChatsAsync(string query, CancellationToken cancellationToken = default)
  {
    return await chatRepository.SearchChatsAsync(query ?? string.Empty, cancellationToken);
  }

  public async Task<List<Chat>> GetChatsForUserAsync(Guid userId, string query = "", CancellationToken cancellationToken = default)
  {
    UserValidator.EnsureUserId(userId);
    return await chatRepository.GetChatsForUserAsync(userId, query ?? string.Empty, cancellationToken);
  }
}