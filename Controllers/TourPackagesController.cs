using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BigBangTravelPortalAPI.Data;
using BigBangTravelPortalAPI.Models;

namespace BigBangTravelPortalAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TourPackagesController : ControllerBase
    {
        private readonly TravelPortalContext _context;

        public TourPackagesController(TravelPortalContext context)
        {
            _context = context;
        }

        // GET: api/TourPackages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TourPackage>>> GetTourPackages()
        {
            return await _context.TourPackages.Include(x=>x.Bookings).Include(x=>x.TravelAgent).ToListAsync();
        }

        // GET: api/TourPackages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TourPackage>> GetTourPackage(int id)
        {
            var tourPackage = await _context.TourPackages.FindAsync(id);

            if (tourPackage == null)
            {
                return NotFound();
            }

            return tourPackage;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTourPackage(int id, [FromForm] TourPackage tourPackage, IFormFile locationImageFile, IFormFile hotelImageFile)
        {
            if (id != tourPackage.TourPackage_Id)
            {
                return BadRequest();
            }

            var existingTourPackage = await _context.TourPackages
                .Include(tp => tp.TravelAgent)
                .ThenInclude(ta => ta.Administrator)
                .FirstOrDefaultAsync(tp => tp.TourPackage_Id == id);

            if (existingTourPackage == null)
            {
                return NotFound();
            }

            if (existingTourPackage.TravelAgent.TravelAgent_IsApproved != "Approved")
            {
                return BadRequest("Travel Agent is not approved. TourPackage cannot be updated.");
            }

            existingTourPackage.TourPackage_Name = tourPackage.TourPackage_Name;
            existingTourPackage.TourPackage_Location = tourPackage.TourPackage_Location;
            existingTourPackage.TourPackage_HotelName = tourPackage.TourPackage_HotelName;
            existingTourPackage.TourPackage_PricePerDay = tourPackage.TourPackage_PricePerDay;

            if (locationImageFile != null && locationImageFile.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await locationImageFile.CopyToAsync(ms);
                    existingTourPackage.Location_Image = Convert.ToBase64String(ms.ToArray());
                }
            }

            if (hotelImageFile != null && hotelImageFile.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await hotelImageFile.CopyToAsync(ms);
                    existingTourPackage.Hotel_Image = Convert.ToBase64String(ms.ToArray());
                }
            }

            _context.Entry(existingTourPackage).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/TourPackages
        [HttpPost]
        public async Task<ActionResult<TourPackage>> PostTourPackage([FromForm] TourPackage tourPackage, IFormFile locationImageFile, IFormFile hotelImageFile)
        {
            var travelAgentId = tourPackage.TravelAgent?.TravelAgent_Id ?? 0;
            var travelAgent = await _context.TravelAgents
                .Include(ta => ta.Administrator)
                .FirstOrDefaultAsync(ta => ta.TravelAgent_Id == travelAgentId);

            if (travelAgent == null)
            {
                return NotFound("Travel Agent not found");
            }

            if (travelAgent.TravelAgent_IsApproved != "Approved")
            {
                return BadRequest("Travel Agent is not approved. TourPackage cannot be posted.");
            }

            tourPackage.TourPackage_Id = 0; 

            if (locationImageFile != null && locationImageFile.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await locationImageFile.CopyToAsync(ms);
                    tourPackage.Location_Image = Convert.ToBase64String(ms.ToArray());
                }
            }
            else
            {
                tourPackage.Location_Image = string.Empty; 
            }

            if (hotelImageFile != null && hotelImageFile.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await hotelImageFile.CopyToAsync(ms);
                    tourPackage.Hotel_Image = Convert.ToBase64String(ms.ToArray());
                }
            }
            else
            {
                tourPackage.Hotel_Image = string.Empty; 
            }

            tourPackage.TravelAgent.TravelAgent_Username = null;
            tourPackage.TravelAgent.TravelAgent_Password = null;

            if (travelAgent.Administrator != null)
            {
                tourPackage.TravelAgent.Administrator = new Administrator
                {
                    Admin_Id = travelAgent.Administrator.Admin_Id,
                    Admin_Username = travelAgent.Administrator.Admin_Username,
                    Admin_Password = travelAgent.Administrator.Admin_Password
                };
            }

            tourPackage.TravelAgent = travelAgent;

            _context.TourPackages.Add(tourPackage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTourPackage", new { id = tourPackage.TourPackage_Id }, tourPackage);
        }


        // DELETE: api/TourPackages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTourPackage(int id)
        {
            var tourPackage = await _context.TourPackages.FindAsync(id);
            if (tourPackage == null)
            {
                return NotFound();
            }

            _context.TourPackages.Remove(tourPackage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("GetTourPackagesByPriceAscending")]
        public async Task<ActionResult<IEnumerable<TourPackage>>> GetTourPackagesByPrice()
        {
            var sortedTourPackages = await _context.TourPackages.OrderBy(tp => tp.TourPackage_PricePerDay).ToListAsync();
            return sortedTourPackages;
        }

        // GET: api/TourPackages/GetTourPackagesByPriceDescending
        [HttpGet("GetTourPackagesByPriceDescending")]
        public async Task<ActionResult<IEnumerable<TourPackage>>> GetTourPackagesByPriceDescending()
        {
            var sortedTourPackages = await _context.TourPackages.OrderByDescending(tp => tp.TourPackage_PricePerDay).ToListAsync();
            return sortedTourPackages;
        }

        // GET: api/TourPackages/GetTop3TourPackagesWithMostBookings
        [HttpGet("GetTop3TourPackagesWithMostBookings")]
        public async Task<ActionResult<IEnumerable<TourPackage>>> GetTop3TourPackagesWithMostBookings()
        {
            var top3TourPackages = await _context.TourPackages
                .OrderByDescending(tp => tp.Bookings.Count)
                .Take(3) 
                .ToListAsync();

            return top3TourPackages;
        }

        // GET: api/TourPackages/GetTourPackagesByFilters
        [HttpGet("GetTourPackagesByFilters")]
        public async Task<ActionResult<IEnumerable<TourPackage>>> GetTourPackagesByFilters(string locationName, decimal? pricePerDay, string speciality, string nearbySpots)
        {
            // Query the database using EF Core
            var query = _context.TourPackages.AsQueryable();

            if (!string.IsNullOrEmpty(locationName))
            {
                query = query.Where(p => p.TourPackage_Location.Contains(locationName));
            }

            if (pricePerDay.HasValue)
            {
                query = query.Where(p => p.TourPackage_PricePerDay == pricePerDay.Value);
            }

            if (!string.IsNullOrEmpty(speciality))
            {
                query = query.Where(p => p.Location_Speciality.Contains(speciality));
            }

            if (!string.IsNullOrEmpty(nearbySpots))
            {
                query = query.Where(p => p.Spots_Nearby.Contains(nearbySpots));
            }

            var result = await query.ToListAsync();
            return Ok(result);
        }


        private bool TourPackageExists(int id)
        {
            return _context.TourPackages.Any(e => e.TourPackage_Id == id);
        }
    }
}
