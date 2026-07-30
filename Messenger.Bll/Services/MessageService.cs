public class MessageService(IMessageRepository messageRepository) : IMessageService
{
  public async Task<Guid> SaveMessageAsync(Guid chatId, Guid senderId, string text, CancellationToken cancellationToken = default)
  {
    MessageValidator.EnsureMessage(chatId, senderId, text);
    return await messageRepository.SaveMessageAsync(chatId, senderId, text, cancellationToken);
  }

  public async Task<List<Message>> LoadMessagesAsync(Guid chatId, CancellationToken cancellationToken = default)
  {
    MessageValidator.EnsureChatIdForLoad(chatId);
    return await messageRepository.LoadMessagesAsync(chatId, cancellationToken);
  }
}