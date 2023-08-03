using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace BigBangTravelPortalAPI.Models
{
    public class Traveler
    {
        [Key]
        public int Traveller_Id { get; set; }

        [StringLength(100, ErrorMessage = "Traveller_Username must not exceed 100 characters.")]
        public string Traveller_Username { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Traveller_Email { get; set; }

        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one special character.")]
        public string Traveller_Password { get; set; }

        public ICollection<Booking> Bookings { get; set; }
    }
}
