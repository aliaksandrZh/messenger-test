using Messenger.SignalR;
using Messenger.SignalR.Hubs;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddSignalRServer();
builder.Services.AddCors(o => o.AddPolicy("DevCors", p => p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

app.UseCors("DevCors");
app.MapHub<ChatHub>("/hubs/chat");

app.Run();