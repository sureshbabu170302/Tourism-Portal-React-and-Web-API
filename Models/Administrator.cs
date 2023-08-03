using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BigBangTravelPortalAPI.Models
{
    public class Administrator
    {
        [Key]
        public int Admin_Id { get; set; }

        [StringLength(100, ErrorMessage = "Admin_Username must not exceed 100 characters.")]
        public string Admin_Username { get; set; }
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Admin_Email { get; set; }

        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
             ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter and one special character.")]
        public string Admin_Password { get; set; }

        public ICollection<TravelAgent> TravelAgents { get; set; }
    }
}
