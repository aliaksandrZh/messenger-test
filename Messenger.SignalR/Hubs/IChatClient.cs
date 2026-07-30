using Messenger.Contracts.Dtos;

namespace Messenger.SignalR.Hubs;

/// <summary>
/// Typed client callbacks invoked by the server on connected clients.
/// </summary>
public interface IChatClient
{
  Task ReceiveMessage(MessageDto message);
  Task UserJoined(Guid chatId, Guid userId);
  Task UserLeft(Guid chatId, Guid userId);
}