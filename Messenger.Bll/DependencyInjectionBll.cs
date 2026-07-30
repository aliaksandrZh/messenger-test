using Microsoft.Extensions.DependencyInjection;

public static class DependencyInjectionBll
{
  public static IServiceCollection AddBll(this IServiceCollection services)
  {
    services.AddDal();
    services.AddScoped<IUserService, UserService>();
    services.AddScoped<IChatService, ChatService>();
    services.AddScoped<IMessageService, MessageService>();
    return services;
  }
}