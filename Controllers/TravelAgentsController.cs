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
    public class TravelAgentsController : ControllerBase
    {
        private readonly TravelPortalContext _context;

        public TravelAgentsController(TravelPortalContext context)
        {
            _context = context;
        }

        // GET: api/TravelAgents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelAgent>>> GetTravelAgents()
        {
            return await _context.TravelAgents.Include(x=>x.Administrator).ToListAsync();
        }

        // GET: api/TravelAgents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelAgent>> GetTravelAgent(int id)
        {
            var travelAgent = await _context.TravelAgents.FindAsync(id);

            if (travelAgent == null)
            {
                return NotFound();
            }

            return travelAgent;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTravelAgent(int id, TravelAgent travelAgent)
        {
            if (id != travelAgent.TravelAgent_Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Return validation errors in the response
            }

            _context.Entry(travelAgent).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TravelAgentExists(id))
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

        // POST: api/TravelAgents
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TravelAgent>> PostTravelAgent(TravelAgent travelAgent)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = await _context.Administrators.FindAsync(1);
            if (admin == null)
            {
                return NotFound();
            }

            travelAgent.Administrator = admin;
            travelAgent.TravelAgent_IsApproved = "Pending";

            _context.TravelAgents.Add(travelAgent);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTravelAgent", new { id = travelAgent.TravelAgent_Id }, travelAgent);
        }




        // DELETE: api/TravelAgents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTravelAgent(int id)
        {
            var travelAgent = await _context.TravelAgents.FindAsync(id);
            if (travelAgent == null)
            {
                return NotFound();
            }

            _context.TravelAgents.Remove(travelAgent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/TravelAgents/Approved
        [HttpGet("Approved")]
        public async Task<ActionResult<IEnumerable<TravelAgent>>> GetApprovedTravelAgents()
        {
            var approvedTravelAgents = await _context.TravelAgents
                .Include(ta => ta.Administrator)
                .Where(ta => ta.TravelAgent_IsApproved == "Approved")
                .ToListAsync();

            return approvedTravelAgents;
        }


        private bool TravelAgentExists(int id)
        {
            return _context.TravelAgents.Any(e => e.TravelAgent_Id == id);
        }
    }
}
