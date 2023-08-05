using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BigBangTravelPortalAPI.Data;
using BigBangTravelPortalAPI.Models;

namespace TravelPortalSample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TravelersController : ControllerBase
    {
        private readonly TravelPortalContext _context;

        public TravelersController(TravelPortalContext context)
        {
            _context = context;
        }

        // GET: api/Travelers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Traveler>>> GetTravelers()
        {
            return await _context.Travelers.ToListAsync();
        }

        // GET: api/Travelers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Traveler>> GetTraveler(int id)
        {
            var traveler = await _context.Travelers.FindAsync(id);

            if (traveler == null)
            {
                return NotFound();
            }

            return traveler;
        }

        // PUT: api/Travelers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTraveler(int id, Traveler traveler)
        {
            if (id != traveler.Traveller_Id)
            {
                return BadRequest();
            }

            _context.Entry(traveler).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TravelerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Traveler>> PostTraveler(Traveler traveler)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Travelers.Add(traveler);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTraveler", new { id = traveler.Traveller_Id }, traveler);
        }

        // DELETE: api/Travelers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTraveler(int id)
        {
            var traveler = await _context.Travelers.FindAsync(id);
            if (traveler == null)
            {
                return NotFound();
            }

            _context.Travelers.Remove(traveler);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TravelerExists(int id)
        {
            return _context.Travelers.Any(e => e.Traveller_Id == id);
        }
    }
}
