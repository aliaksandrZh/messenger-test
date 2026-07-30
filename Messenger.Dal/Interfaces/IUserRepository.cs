public interface IUserRepository
{
  Task<User> CreateUserAsync(string name, string email, CancellationToken cancellationToken = default);
  Task<User> GetUserAsync(Guid userId, CancellationToken cancellationToken = default);
  Task<Guid> SaveContactAsync(Guid userId, Guid contactId, CancellationToken cancellationToken = default);
  Task<List<User>> SearchUsersAsync(string query, CancellationToken cancellationToken = default);
  Task<List<User>> GetContactsAsync(Guid userId, CancellationToken cancellationToken = default);
}