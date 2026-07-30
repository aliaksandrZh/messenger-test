using Microsoft.EntityFrameworkCore;

public class ChatsRepository(CoreContext context) : RepositoryBase<CoreContext>(context), IChatRepository
{
  // Creates the chat and adds its creator as the first Participant in a single
  // transaction (one SaveChangesAsync). Done "under the hood" so the API caller
  // makes one request instead of create-then-join.
  public async Task<Guid> CreateChatAsync(string name, Guid creatorUserId, CancellationToken cancellationToken = default)
  {
    var chat = new Chat
    {
      Id = Guid.NewGuid(),
      Name = name
    };
    var creator = new Participant
    {
      ChatId = chat.Id,
      UserId = creatorUserId
    };

    await Context.Chats.AddAsync(chat, cancellationToken);
    await Context.Participants.AddAsync(creator, cancellationToken);
    await Context.SaveChangesAsync(cancellationToken);
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

  public async Task<List<Chat>> SearchChatsAsync(string query, CancellationToken cancellationToken = default)
  {
    return await Context.Chats
        .Where(c => string.IsNullOrEmpty(query) || c.Name.Contains(query))
        .ToListAsync(cancellationToken);
  }

  public async Task<List<Chat>> GetChatsForUserAsync(Guid userId, string query = "", CancellationToken cancellationToken = default)
  {
    return await Context.Chats
        .Where(c => Context.Participants.Any(p => p.ChatId == c.Id && p.UserId == userId))
        .Where(c => string.IsNullOrEmpty(query) || c.Name.Contains(query))
        .ToListAsync(cancellationToken);
  }
}