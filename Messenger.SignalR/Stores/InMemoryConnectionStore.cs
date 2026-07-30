using System.Collections.Concurrent;
using Messenger.SignalR.Interfaces;

namespace Messenger.SignalR.Stores;

public class InMemoryConnectionStore : IConnectionStore
{
  private readonly ConcurrentDictionary<string, Guid> _connections = new();

  public Task AddAsync(string connectionId, Guid userId, CancellationToken cancellationToken = default)
  {
    _connections[connectionId] = userId;
    return Task.CompletedTask;
  }

  public Task RemoveAsync(string connectionId, CancellationToken cancellationToken = default)
  {
    _connections.TryRemove(connectionId, out _);
    return Task.CompletedTask;
  }

  public Task<Guid?> GetUserIdAsync(string connectionId, CancellationToken cancellationToken = default)
  {
    var userId = _connections.TryGetValue(connectionId, out var id) ? id : (Guid?)null;
    return Task.FromResult(userId);
  }

  public Task<IReadOnlyList<string>> GetConnectionIdsAsync(Guid userId, CancellationToken cancellationToken = default)
  {
    var ids = _connections
        .Where(kv => kv.Value == userId)
        .Select(kv => kv.Key)
        .ToList();

    return Task.FromResult<IReadOnlyList<string>>(ids);
  }
}