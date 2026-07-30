public class ChatService(IChatRepository chatRepository) : IChatService
{
  public async Task<Guid> CreateChatAsync(string name, CancellationToken cancellationToken = default)
  {
    ChatValidator.EnsureChatName(name);
    return await chatRepository.CreateChatAsync(name, cancellationToken);
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
}