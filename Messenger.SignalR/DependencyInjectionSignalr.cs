using Messenger.SignalR.Interfaces;
using Messenger.SignalR.Services;
using Messenger.SignalR.Stores;

public static class DependencyInjectionSignalr
{
  public static IServiceCollection AddSignalRServer(this IServiceCollection services)
  {
    services.AddBll();
    services.AddSignalR();
    services.AddSingleton<IConnectionStore, InMemoryConnectionStore>();
    services.AddScoped<ISignalRService, SignalRService>();
    return services;
  }
}