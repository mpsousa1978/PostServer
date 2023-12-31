using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace aspnetserver.Data
{
    internal static class PostRepository
    {
        internal async static Task<List<Post>> GetPostsAsync()
        {
            using (var db = new AppDbContext())
            {
                return await db.Posts.ToListAsync();
            }
        }

        internal async static Task<Post> GetPostByIdAsync(int postId)
        {
            using (var db = new AppDbContext())
            {
                return await db.Posts.FirstOrDefaultAsync(post => post.PostId == postId);
            }
        }

        internal async static Task<bool> CreatePostAsync(Post post)
        {
            using (var db = new AppDbContext())
            {
                try
                {
                    await db.Posts.AddAsync(post);
                    return await db.SaveChangesAsync() >= 1;                }
                catch (Exception)
                {

                    return false;
                }
            }
        }

        internal async static Task<bool> UpdatePostAsync(Post post)
        {
            using (var db = new AppDbContext())
            {
                try
                {
                    db.Posts.Update(post);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch (Exception)
                {

                    return false;
                }
            }
        }
        internal async static Task<bool> DeletePostAsync(int postId)
        {
            using (var db = new AppDbContext())
            {
                try
                {
                    Post PostToDelete = await GetPostByIdAsync(postId);
                    db.Remove(PostToDelete);
                    return await db.SaveChangesAsync() >= 1;
                }
                catch (Exception)
                {

                    return false;
                }
            }
        }

    }


}
