public static class MessageValidator
{
  public static void EnsureMessage(Guid chatId, Guid senderId, string text)
  {
    if (chatId == Guid.Empty)
      throw new ArgumentException("Chat id must not be empty.", nameof(chatId));
    if (senderId == Guid.Empty)
      throw new ArgumentException("Sender id must not be empty.", nameof(senderId));
    if (string.IsNullOrWhiteSpace(text))
      throw new ArgumentException("Message text must not be empty.", nameof(text));
  }

  public static void EnsureChatIdForLoad(Guid chatId)
  {
    if (chatId == Guid.Empty)
      throw new ArgumentException("Chat id must not be empty.", nameof(chatId));
  }
}