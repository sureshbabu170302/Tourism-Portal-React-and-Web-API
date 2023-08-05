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
    public class AdministratorsController : ControllerBase
    {
        private readonly TravelPortalContext _context;

        public AdministratorsController(TravelPortalContext context)
        {
            _context = context;
        }

        // GET: api/Administrators
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Administrator>>> GetAdministrators()
        {
            return await _context.Administrators.Include(x => x.TravelAgents).ToListAsync();
        }

        // GET: api/Administrators/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Administrator>> GetAdministrator(int id)
        {
            var administrator = await _context.Administrators.FindAsync(id);

            if (administrator == null)
            {
                return NotFound();
            }

            return administrator;
        }

        // PUT: api/Administrators/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdministrator(int id, Administrator administrator)
        {
            if (id != administrator.Admin_Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(administrator).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdministratorExists(id))
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

        // POST: api/Administrators
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Administrator>> PostAdministrator(Administrator administrator)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Administrators.Add(administrator);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAdministrator", new { id = administrator.Admin_Id }, administrator);
        }

        // DELETE: api/Administrators/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdministrator(int id)
        {
            var administrator = await _context.Administrators.FindAsync(id);
            if (administrator == null)
            {
                return NotFound();
            }

            _context.Administrators.Remove(administrator);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("UnapprovedTravelAgents")]
        public async Task<ActionResult<IEnumerable<TravelAgent>>> GetUnapprovedTravelAgents()
        {
            var unapprovedTravelAgents = await _context.TravelAgents
                .Include(ta => ta.Administrator)
                .Where(ta => ta.TravelAgent_IsApproved == "Pending")
                .ToListAsync();

            return unapprovedTravelAgents;
        }

        // GET: api/Administrators/ApprovedTravelAgents
        [HttpGet("ApprovedTravelAgents")]
        public async Task<ActionResult<IEnumerable<TravelAgent>>> GetApprovedTravelAgents()
        {
            var approvedTravelAgents = await _context.TravelAgents
                .Include(ta => ta.Administrator)
                .Where(ta => ta.TravelAgent_IsApproved == "Approved")
                .ToListAsync();

            return approvedTravelAgents;
        }

        // GET: api/Administrators/DeclinedTravelAgents
        [HttpGet("DeclinedTravelAgents")]
        public async Task<ActionResult<IEnumerable<TravelAgent>>> GetDeclinedTravelAgents()
        {
            var declinedTravelAgents = await _context.TravelAgents
                .Include(ta => ta.Administrator)
                .Where(ta => ta.TravelAgent_IsApproved == "Declined")
                .ToListAsync();

            return declinedTravelAgents;
        }


        // PUT: api/Administrators/UpdateApprovalStatus/{id}
        [HttpPut("UpdateApprovalStatus/{id}")]
        public async Task<IActionResult> UpdateApprovalStatus(int id, [FromBody] string approvalStatus)
        {
            var travelAgent = await _context.TravelAgents.FindAsync(id);
            if (travelAgent == null)
            {
                return NotFound("Travel Agent not found");
            }

            if (approvalStatus != "Approved" && approvalStatus != "Declined")
            {
                return BadRequest("Invalid approval status. It should be either 'Approved' or 'Declined'.");
            }

            travelAgent.TravelAgent_IsApproved = approvalStatus;

            await _context.SaveChangesAsync();

            return Ok("Approval status updated successfully");
        }

        private bool AdministratorExists(int id)
        {
            return _context.Administrators.Any(e => e.Admin_Id == id);
        }
    }
}
