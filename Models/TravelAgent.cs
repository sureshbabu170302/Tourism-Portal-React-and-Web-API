using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace BigBangTravelPortalAPI.Models
{
    public class TravelAgent
    {
        [Key]
        public int TravelAgent_Id { get; set; }

        [StringLength(100, ErrorMessage = "TravelAgent_Username must not exceed 100 characters.")]
        public string TravelAgent_Username { get; set; }
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string TravelAgent_Email { get; set; }

        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
            ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one special character.")]
        public string TravelAgent_Password { get; set; }

        public string TravelAgent_IsApproved { get; set; }

        public Administrator Administrator { get; set; }

        public ICollection<TourPackage> TourPackages { get; set; }
    }
}
