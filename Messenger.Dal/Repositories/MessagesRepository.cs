using Microsoft.EntityFrameworkCore;

public class MessagesRepository(CoreContext context) : RepositoryBase<CoreContext>(context), IMessageRepository
{
  public async Task<Guid> SaveMessageAsync(Guid chatId, Guid senderId, string text, CancellationToken cancellationToken = default)
  {
    var message = new Message
    {
      Id = Guid.NewGuid(),
      ChatId = chatId,
      Text = text,
      CreatedBy = senderId
    };

    await AddAsync(message, cancellationToken);
    return message.Id;
  }

  public async Task<List<Message>> LoadMessagesAsync(Guid chatId, CancellationToken cancellationToken = default)
  {
    return await Context.Messages
        .Where(m => m.ChatId == chatId)
        .OrderBy(m => m.CreatedAtUtc)
        .ToListAsync(cancellationToken);
  }
}