public class User
{
  public Guid Id { get; set; }
  public required string Name { get; set; }
  public required string Email { get; set; }

  public virtual ICollection<Contact> Contacts { get; set; } = [];
  public virtual ICollection<Message> SentMessages { get; set; } = [];
  public virtual ICollection<Participant> Participants { get; set; } = [];
}