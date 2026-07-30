public interface IUserRepository
{
  Task<User> CreateUserAsync(string name, string email, CancellationToken cancellationToken = default);
  Task<User> GetUserAsync(Guid userId, CancellationToken cancellationToken = default);
  Task<Guid> SaveContactAsync(Guid userId, Guid contactId, CancellationToken cancellationToken = default);
}