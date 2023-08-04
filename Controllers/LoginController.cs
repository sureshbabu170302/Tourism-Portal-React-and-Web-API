using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BigBangTravelPortalAPI.Models;
using BigBangTravelPortalAPI.Data;


namespace BigBangTravelPortalAPI
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokensController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly TravelPortalContext _context;


        private const string AdminRole = "Admin";
        private const string UserRole = "Traveller";
        private const string TravellerAgentRole = "TravellerAgent";



        public TokensController(IConfiguration configuration, TravelPortalContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("Traveler")]
        public async Task<IActionResult> Post(Traveler _userData)
        {
            if (_userData != null && !string.IsNullOrEmpty(_userData.Traveller_Email) && !string.IsNullOrEmpty(_userData.Traveller_Password))
            {
                var user = await GetUser(_userData.Traveller_Email, _userData.Traveller_Password);

                if (user != null)
                {
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),

                        new Claim("Traveller_Email", user.Traveller_Email),
                         new Claim("Admin_Password", user.Traveller_Password),
                        new Claim(ClaimTypes.Role,TravellerAgentRole)
                    };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(29),
                        signingCredentials: signIn);

                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));
                }
                else
                {
                    return BadRequest("Invalid credentials");
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("Administrator")]
        public async Task<IActionResult> Post(Administrator _userData)
        {
            if (_userData != null && !string.IsNullOrEmpty(_userData.Admin_Email) && !string.IsNullOrEmpty(_userData.Admin_Password))
            {
                var user = await GetAdmin(_userData.Admin_Email, _userData.Admin_Password);

                if (user != null)
                {
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),

                        new Claim("Admin_Email", user.Admin_Email),
                         new Claim("Admin_Password", user.Admin_Password),
                        new Claim(ClaimTypes.Role,AdminRole)
                    };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(29),
                        signingCredentials: signIn);

                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));
                }
                else
                {
                    return BadRequest("Invalid credentials");
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost("TravelAgent")]
        public async Task<IActionResult> Post(TravelAgent _userData)
        {
            if (_userData != null && !string.IsNullOrEmpty(_userData.TravelAgent_Email) && !string.IsNullOrEmpty(_userData.TravelAgent_Password))
            {
                var user = await GetAgent(_userData.TravelAgent_Email, _userData.TravelAgent_Password);

                if (user != null)
                {
                    var claims = new[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),

                        new Claim("TravelAgent_Email", user.TravelAgent_Email),
                         new Claim("Traveller_Password", user.TravelAgent_Password),
                        new Claim(ClaimTypes.Role,TravellerAgentRole)
                    };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                    var token = new JwtSecurityToken(
                        _configuration["Jwt:Issuer"],
                        _configuration["Jwt:Audience"],
                        claims,
                        expires: DateTime.UtcNow.AddMinutes(29),
                        signingCredentials: signIn);

                    return Ok(new JwtSecurityTokenHandler().WriteToken(token));
                }
                else
                {
                    return BadRequest("Invalid credentials");
                }
            }
            else
            {
                return BadRequest();
            }
        }


        private async Task<Traveler> GetUser(string email, string password)
        {
            return await _context.Travelers.FirstOrDefaultAsync(u => u.Traveller_Email == email && u.Traveller_Password == password);
        }
        private async Task<Administrator> GetAdmin(string email, string password)
        {
            return await _context.Administrators.FirstOrDefaultAsync(u => u.Admin_Email == email && u.Admin_Password == password);
        }


        private async Task<TravelAgent> GetAgent(string email, string password)
        {
            return await _context.TravelAgents.FirstOrDefaultAsync(u => u.TravelAgent_Email == email && u.TravelAgent_Password == password);
        }
    }
}
