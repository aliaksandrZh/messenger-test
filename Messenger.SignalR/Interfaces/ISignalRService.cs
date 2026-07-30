using Messenger.Contracts.Dtos;

namespace Messenger.SignalR.Interfaces;

/// <summary>
/// In-process broadcaster over the chat hub. Used by external callers (REST, future MQ
/// consumer) to push to clients without invoking a hub method directly.
/// </summary>
public interface ISignalRService
{
  Task SendMessageAsync(MessageDto message, CancellationToken cancellationToken = default);
  Task NotifyUserJoinedAsync(Guid chatId, Guid userId, CancellationToken cancellationToken = default);
  Task NotifyUserLeftAsync(Guid chatId, Guid userId, CancellationToken cancellationToken = default);
}