public class UsersRepository(CoreContext context) : RepositoryBase<CoreContext>(context), IUserRepository
{
  public async Task<User> CreateUserAsync(string name, string email, CancellationToken cancellationToken = default)
  {
    var user = new User
    {
      Id = Guid.NewGuid(),
      Name = name,
      Email = email
    };

    await AddAsync(user, cancellationToken);
    return user;
  }

  public async Task<User> GetUserAsync(Guid userId, CancellationToken cancellationToken = default)
  {
    var user = await Context.Users.FindAsync(userId, cancellationToken);
    return user ?? throw new KeyNotFoundException($"User '{userId}' was not found.");
  }

  public async Task<Guid> SaveContactAsync(Guid userId, Guid contactId, CancellationToken cancellationToken = default)
  {
    var contact = new Contact
    {
      UserId = userId,
      ContactId = contactId
    };

    await AddAsync(contact, cancellationToken);
    return contact.UserId;
  }
}