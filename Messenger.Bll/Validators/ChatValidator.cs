public static class ChatValidator
{
  public static void EnsureChatName(string name)
  {
    if (string.IsNullOrWhiteSpace(name))
      throw new ArgumentException("Chat name must not be empty.", nameof(name));
  }

  public static void EnsureChatId(Guid chatId, string paramName = "chatId")
  {
    if (chatId == Guid.Empty)
      throw new ArgumentException("Chat id must not be empty.", paramName);
  }

  public static void EnsureUserIds(List<Guid> userIds)
  {
    if (userIds is null || userIds.Count == 0)
      throw new ArgumentException("At least one user id is required.", nameof(userIds));
    if (userIds.Any(id => id == Guid.Empty))
      throw new ArgumentException("User ids must not be empty.", nameof(userIds));
  }
}