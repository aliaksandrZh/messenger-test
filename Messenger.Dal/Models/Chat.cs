public class Chat
{
  public Guid Id { get; set; }
  public required string Name { get; set; }

  public virtual ICollection<Message> Messages { get; set; } = [];
  public virtual ICollection<Participant> Participants { get; set; } = [];
}