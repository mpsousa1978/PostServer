using aspnetserver.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORRsPolicy", builder => {
        builder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .WithOrigins("http://localhost:3000", "https://appname.azurestaticapps.net");
        });
});
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(setUp =>
{
    setUp.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "Asp.net React API",
            Version = "v1"
        }
        );
}
    );


var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI(setUp=>
    {
        setUp.DocumentTitle = "Asp.net Reat";
        setUp.SwaggerEndpoint("/swagger/v1/swagger.json", "web api serving");
        setUp.RoutePrefix = string.Empty;
    });
//}

app.UseHttpsRedirection();

app.UseCors("CORRsPolicy");

app.MapGet("/get-all-posts", async () => await PostRepository.GetPostsAsync())
    .WithTags("Posts endpoint");

app.MapGet("/get-post-by-id/{postId}", async (int postId) =>
{
    Post postReturn = await PostRepository.GetPostByIdAsync(postId);
    if (postReturn != null)
    {
        return Results.Ok(postReturn);
    }
    else
    {
        return Results.BadRequest();
    }

}).WithTags("Posts endpoint");


app.MapPost("/create-post", async (Post postCreate) =>
{
    bool createSuccessFul = await PostRepository.CreatePostAsync(postCreate);
    if (createSuccessFul != null)
    {
        return Results.Ok(createSuccessFul);
    }
    else
    {
        return Results.BadRequest();
    }

}).WithTags("Posts endpoint");


app.MapPut  ("/update-post", async (Post postUpdate) =>
{
    bool updateSuccessFul = await PostRepository.UpdatePostAsync(postUpdate);
    if (updateSuccessFul != null)
    {
        return Results.Ok(updateSuccessFul);
    }
    else
    {
        return Results.BadRequest();
    }

}).WithTags("Posts endpoint");

app.MapDelete("/delete-post-by-id/{postId}", async (int postId) =>
{
    bool postReturn = await PostRepository.DeletePostAsync(postId);
    if (postReturn != null)
    {
        return Results.Ok(postReturn);
    }
    else
    {
        return Results.BadRequest();
    }

}).WithTags("Posts endpoint");

app.Run();