using Microsoft.AspNetCore.SignalR;
using Messenger.Contracts.Dtos;
using Messenger.SignalR.Interfaces;

namespace Messenger.SignalR.Hubs;

public class ChatHub(IMessageService messageService, IConnectionStore connectionStore) : Hub<IChatClient>
{
  public override async Task OnDisconnectedAsync(Exception? exception)
  {
    await connectionStore.RemoveAsync(Context.ConnectionId);
    await base.OnDisconnectedAsync(exception);
  }

  public async Task JoinChatAsync(Guid chatId, Guid userId)
  {
    await connectionStore.AddAsync(Context.ConnectionId, userId);
    await Groups.AddToGroupAsync(Context.ConnectionId, ChatGroups.For(chatId));
    await Clients.Group(ChatGroups.For(chatId)).UserJoined(chatId, userId);
  }

  public async Task LeaveChatAsync(Guid chatId)
  {
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, ChatGroups.For(chatId));
    var userId = await connectionStore.GetUserIdAsync(Context.ConnectionId);
    if (userId is not null)
      await Clients.Group(ChatGroups.For(chatId)).UserLeft(chatId, userId.Value);
  }

  public async Task SendMessageAsync(Guid chatId, string text)
  {
    var senderId = await connectionStore.GetUserIdAsync(Context.ConnectionId);
    if (senderId is null)
      throw new HubException("Connection has no associated user. Call JoinChatAsync first.");

    var messageId = await messageService.SaveMessageAsync(chatId, senderId.Value, text);
    var dto = new MessageDto(messageId, chatId, senderId.Value, text, DateTime.UtcNow);
    await Clients.Group(ChatGroups.For(chatId)).ReceiveMessage(dto);
  }
}