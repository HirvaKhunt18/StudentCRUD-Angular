using Microsoft.EntityFrameworkCore;

namespace StudentCrudAPI.Models
{
    public class StudentDbContext : DbContext
    {

        public StudentDbContext(DbContextOptions<StudentDbContext> options)
           : base(options)
        {
        }

        public DbSet<Student> Student { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<State> State { get; set; }
        public DbSet<Hobbies> Hobbies { get; set; }
    }
}
