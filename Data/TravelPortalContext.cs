using BigBangTravelPortalAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BigBangTravelPortalAPI.Data
{
    public class TravelPortalContext :DbContext
    {
        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<TravelAgent> TravelAgents { get; set; }
        public DbSet<Traveler> Travelers { get; set; }
        public DbSet<TourPackage> TourPackages { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        public TravelPortalContext(DbContextOptions<TravelPortalContext> options) : base(options)
        {
        }
    }
}
