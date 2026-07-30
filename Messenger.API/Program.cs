var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

builder.Services.AddBll();
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("DevCors", p => p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("DevCors");
app.MapControllers();

app.Run();