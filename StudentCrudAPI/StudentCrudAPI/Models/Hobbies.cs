using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StudentCrudAPI.Models
{
    public class Hobbies
    {
        [Key]
       [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HobbyId { get; set; }

        public string HobbyName { get; set; }
        [NotMapped]
        public bool IsChecked { get; set; }
    }
}
