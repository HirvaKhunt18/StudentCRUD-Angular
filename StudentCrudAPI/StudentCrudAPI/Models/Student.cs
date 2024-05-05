using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StudentCrudAPI.Models
{
    public class Student
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StudentId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        [NotMapped]
        public int StateId { get; set; }

        [ForeignKey("City")]
        public int CityId { get; set; }
      
        public string HobbiesIds { get; set; }
        [NotMapped]
        public int[] Hobbies { get; set; }

        public string Gender { get; set; }

        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        public DateTime DateOfBirth { get; set; }
        [NotMapped]
        public string DateFormat { get; set; }

    }
}
