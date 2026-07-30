using Messenger.SignalR;
using Messenger.SignalR.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalRServer();

var app = builder.Build();

app.MapHub<ChatHub>("/hubs/chat");

app.Run();