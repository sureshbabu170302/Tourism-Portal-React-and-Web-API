using System.ComponentModel.DataAnnotations;

namespace BigBangTravelPortalAPI.Models
{
    public class Booking
    {
        [Key]
        public int Booking_Id { get; set; }
        public string Booking_Date { get; set; }
        public int Booking_NoOfDays { get; set; }
        public decimal Booking_TotalAmount { get; set; }
        public Traveler Traveler { get; set; }
        public TourPackage TourPackage { get; set; }
    }
}
