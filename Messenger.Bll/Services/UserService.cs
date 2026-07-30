public class UserService(IUserRepository userRepository) : IUserService
{
  public async Task<User> CreateUserAsync(string name, string email, CancellationToken cancellationToken = default)
  {
    UserValidator.EnsureName(name);
    UserValidator.EnsureEmail(email);
    return await userRepository.CreateUserAsync(name, email, cancellationToken);
  }

  public async Task<User> GetUserAsync(Guid userId, CancellationToken cancellationToken = default)
  {
    UserValidator.EnsureUserId(userId);
    return await userRepository.GetUserAsync(userId, cancellationToken);
  }

  public async Task<Guid> SaveContactAsync(Guid userId, Guid contactId, CancellationToken cancellationToken = default)
  {
    UserValidator.EnsureContact(userId, contactId);
    return await userRepository.SaveContactAsync(userId, contactId, cancellationToken);
  }

  public async Task<List<User>> SearchUsersAsync(string query, CancellationToken cancellationToken = default)
  {
    return await userRepository.SearchUsersAsync(query ?? string.Empty, cancellationToken);
  }

  public async Task<List<User>> GetContactsAsync(Guid userId, CancellationToken cancellationToken = default)
  {
    UserValidator.EnsureUserId(userId);
    return await userRepository.GetContactsAsync(userId, cancellationToken);
  }
}