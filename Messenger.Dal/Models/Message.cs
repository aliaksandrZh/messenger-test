public class Message : CreateInfo<Guid>
{
  public Guid Id { get; set; }
  public Guid ChatId { get; set; }
  public required string Text { get; set; }

  public virtual Chat Chat { get; set; } = null!;
  public virtual User Sender { get; set; } = null!;
}