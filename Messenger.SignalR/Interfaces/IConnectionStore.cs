namespace Messenger.SignalR.Interfaces;

/// <summary>
/// Tracks active hub connections. In-memory now; will be swapped for a Redis-backed
/// implementation later (same interface, different impl).
/// </summary>
public interface IConnectionStore
{
  Task AddAsync(string connectionId, Guid userId, CancellationToken cancellationToken = default);
  Task RemoveAsync(string connectionId, CancellationToken cancellationToken = default);
  Task<Guid?> GetUserIdAsync(string connectionId, CancellationToken cancellationToken = default);
  Task<IReadOnlyList<string>> GetConnectionIdsAsync(Guid userId, CancellationToken cancellationToken = default);
}