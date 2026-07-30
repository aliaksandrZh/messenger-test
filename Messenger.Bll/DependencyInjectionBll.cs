using Microsoft.Extensions.DependencyInjection;

public static class DependencyInjectionBll
{
  public static IServiceCollection AddServerBll(this IServiceCollection services)
  {
    services.AddServerDal();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IChatService, ChatService>();
    services.AddScoped<IMessageService, MessageService>();
    return services;
  }
}