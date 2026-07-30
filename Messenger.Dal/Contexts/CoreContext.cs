using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class CoreContext : DbContext
{
  private readonly IConfiguration _config;
  public CoreContext(DbContextOptions<CoreContext> options, IConfiguration config = null) : base(options)
  {
    _config = config;
  }

  #region DbSets
  public virtual DbSet<User> Users { get; set; }
  public virtual DbSet<Contact> Contacts { get; set; }
  public virtual DbSet<Chat> Chats { get; set; }
  public virtual DbSet<Message> Messages { get; set; }
  public virtual DbSet<Participant> Participants { get; set; }

  #endregion

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<User>(b =>
    {
      b.HasKey(u => u.Id);
      b.HasIndex(u => u.Email).IsUnique();

      b.HasMany(u => u.Contacts)
        .WithOne(c => c.OwnerUser)
        .HasForeignKey(c => c.UserId)
        .OnDelete(DeleteBehavior.Cascade);

      b.HasMany(u => u.SentMessages)
        .WithOne(m => m.Sender)
        .HasForeignKey(m => m.CreatedBy)
        .OnDelete(DeleteBehavior.Restrict);

      b.HasMany(u => u.Participants)
        .WithOne(p => p.User)
        .HasForeignKey(p => p.UserId)
        .OnDelete(DeleteBehavior.Cascade);
    });

    modelBuilder.Entity<Contact>(b =>
    {
      b.HasKey(c => new { c.UserId, c.ContactId });

      b.HasOne(c => c.OwnerUser)
        .WithMany(u => u.Contacts)
        .HasForeignKey(c => c.UserId)
        .OnDelete(DeleteBehavior.Cascade);

      b.HasOne(c => c.TargetUser)
        .WithMany()
        .HasForeignKey(c => c.ContactId)
        .OnDelete(DeleteBehavior.Restrict);
    });

    modelBuilder.Entity<Chat>(b =>
    {
      b.HasKey(c => c.Id);

      b.HasMany(c => c.Messages)
        .WithOne(m => m.Chat)
        .HasForeignKey(m => m.ChatId)
        .OnDelete(DeleteBehavior.Cascade);

      b.HasMany(c => c.Participants)
        .WithOne(p => p.Chat)
        .HasForeignKey(p => p.ChatId)
        .OnDelete(DeleteBehavior.Cascade);
    });

    modelBuilder.Entity<Message>(b =>
    {
      b.HasKey(m => m.Id);
    });

    modelBuilder.Entity<Participant>(b =>
    {
      b.HasKey(p => new { p.ChatId, p.UserId });

      b.HasOne(p => p.Chat)
        .WithMany(c => c.Participants)
        .HasForeignKey(p => p.ChatId)
        .OnDelete(DeleteBehavior.Cascade);

      b.HasOne(p => p.User)
        .WithMany(u => u.Participants)
        .HasForeignKey(p => p.UserId)
        .OnDelete(DeleteBehavior.Cascade);
    });
  }
}