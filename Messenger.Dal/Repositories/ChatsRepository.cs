public class ChatsRepository(CoreContext context) : RepositoryBase<CoreContext>(context), IChatRepository
{
  public async Task<Guid> CreateChatAsync(string name, CancellationToken cancellationToken = default)
  {
    var chat = new Chat
    {
      Id = Guid.NewGuid(),
      Name = name
    };

    await AddAsync(chat, cancellationToken);
    return chat.Id;
  }

  public async Task<Guid> AddUsersToChatAsync(Guid chatId, List<Guid> userIds, CancellationToken cancellationToken = default)
  {
    var participants = userIds
        .Select(userId => new Participant { ChatId = chatId, UserId = userId })
        .ToList();

    await AddRangeAsync(participants, cancellationToken);
    return chatId;
  }
}