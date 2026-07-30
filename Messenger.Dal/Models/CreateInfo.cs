public class CreateInfo<T>
{
  public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
  public required T CreatedBy { get; set; }
}