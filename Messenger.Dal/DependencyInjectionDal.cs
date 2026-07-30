using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

public static class DependencyInjectionDal
{
  public static IServiceCollection AddContexts(this IServiceCollection services)
  {
    services.AddDbContext<CoreContext>((provider, builder) =>
    {
      var loggerFactory = provider.GetRequiredService<ILoggerFactory>();
      var config = provider.GetRequiredService<IConfiguration>();
      builder.UseLoggerFactory(loggerFactory)
           .EnableDetailedErrors()
           .EnableSensitiveDataLogging()
           .UseSqlite(config.GetConnectionString("Coredb"));
    });

    return services;
  }

  public static IServiceCollection AddDal(this IServiceCollection services)
  {

    services.AddContexts();
    services.AddScoped<IUserRepository, UsersRepository>();
    services.AddScoped<IChatRepository, ChatsRepository>();
    services.AddScoped<IMessageRepository, MessagesRepository>();
    return services;
  }
}