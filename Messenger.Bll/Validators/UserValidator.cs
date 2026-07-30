public static class UserValidator
{
  public static void EnsureName(string name)
  {
    if (string.IsNullOrWhiteSpace(name))
      throw new ArgumentException("User name must not be empty.", nameof(name));
  }

  public static void EnsureEmail(string email)
  {
    if (string.IsNullOrWhiteSpace(email))
      throw new ArgumentException("User email must not be empty.", nameof(email));
  }

  public static void EnsureUserId(Guid userId, string paramName = "userId")
  {
    if (userId == Guid.Empty)
      throw new ArgumentException("User id must not be empty.", paramName);
  }

  public static void EnsureContact(Guid userId, Guid contactId)
  {
    EnsureUserId(userId, nameof(userId));
    if (contactId == Guid.Empty)
      throw new ArgumentException("Contact id must not be empty.", nameof(contactId));
    if (userId == contactId)
      throw new ArgumentException("A user cannot add themselves as a contact.", nameof(contactId));
  }
}