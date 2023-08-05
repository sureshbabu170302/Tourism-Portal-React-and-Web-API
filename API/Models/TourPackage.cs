using System.ComponentModel.DataAnnotations;
namespace BigBangTravelPortalAPI.Models
{
    public class TourPackage
    {
        [Key]
        public int TourPackage_Id { get; set; }
        public string TourPackage_Name { get; set; }
        public string TourPackage_Location { get; set; }
        public string TourPackage_HotelName { get; set; }
        public decimal TourPackage_PricePerDay { get; set; }
        public string Location_Speciality { get; set; }
        public string Spots_Nearby { get; set; }
        public string Location_Image { get; set; }
        public string Hotel_Image { get; set; }
        public TravelAgent TravelAgent { get; set; }
        public ICollection<Booking> Bookings { get; set; }
    }
}
