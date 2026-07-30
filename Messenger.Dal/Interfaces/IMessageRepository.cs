public interface IMessageRepository
{
  Task<Guid> SaveMessageAsync(Guid chatId, Guid senderId, string text, CancellationToken cancellationToken = default);
  Task<List<Message>> LoadMessagesAsync(Guid chatId, CancellationToken cancellationToken = default);
}