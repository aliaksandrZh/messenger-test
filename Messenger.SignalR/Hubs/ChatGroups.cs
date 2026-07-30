namespace Messenger.SignalR.Hubs;

public static class ChatGroups
{
  public const string Prefix = "chat-";

  public static string For(Guid chatId) => $"{Prefix}{chatId}";
}