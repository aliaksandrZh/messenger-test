using Messenger.Contracts.Dtos;

namespace Messenger.Contracts.Mapping;

public static class ContractMapper
{
  public static UserDto ToDto(User user) => new(user.Id, user.Name, user.Email);

  public static ChatDto ToDto(Chat chat) => new(chat.Id, chat.Name);

  public static MessageDto ToDto(Message message) =>
      new(message.Id, message.ChatId, message.CreatedBy, message.Text, message.CreatedAtUtc);

  public static IReadOnlyList<UserDto> ToDtoList(IEnumerable<User> users) =>
      users.Select(ToDto).ToList();

  public static IReadOnlyList<ChatDto> ToDtoList(IEnumerable<Chat> chats) =>
      chats.Select(ToDto).ToList();

  public static IReadOnlyList<MessageDto> ToDtoList(IEnumerable<Message> messages) =>
      messages.Select(ToDto).ToList();
}