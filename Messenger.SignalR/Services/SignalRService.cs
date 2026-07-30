using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Messenger.Contracts.Dtos;
using Messenger.SignalR.Hubs;
using Messenger.SignalR.Interfaces;

namespace Messenger.SignalR.Services;

public class SignalRService(IHubContext<ChatHub, IChatClient> hubContext, ILogger<SignalRService> logger)
    : ISignalRService
{
  public async Task SendMessageAsync(MessageDto message, CancellationToken cancellationToken = default)
  {
    try
    {
      await hubContext.Clients.Group(ChatGroups.For(message.ChatId)).ReceiveMessage(message);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "SendMessageAsync failed for chat {ChatId}", message.ChatId);
      throw;
    }
  }

  public async Task NotifyUserJoinedAsync(Guid chatId, Guid userId, CancellationToken cancellationToken = default)
  {
    try
    {
      await hubContext.Clients.Group(ChatGroups.For(chatId)).UserJoined(chatId, userId);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "NotifyUserJoinedAsync failed for chat {ChatId}", chatId);
      throw;
    }
  }

  public async Task NotifyUserLeftAsync(Guid chatId, Guid userId, CancellationToken cancellationToken = default)
  {
    try
    {
      await hubContext.Clients.Group(ChatGroups.For(chatId)).UserLeft(chatId, userId);
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "NotifyUserLeftAsync failed for chat {ChatId}", chatId);
      throw;
    }
  }
}