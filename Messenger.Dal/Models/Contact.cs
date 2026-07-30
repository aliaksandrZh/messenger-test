public class Contact
{
  public Guid UserId { get; set; }
  public Guid ContactId { get; set; }

  public virtual User OwnerUser { get; set; } = null!;
  public virtual User TargetUser { get; set; } = null!;
}