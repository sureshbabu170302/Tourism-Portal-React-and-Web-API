using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BigBangTravelPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class init3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Traveller_Email",
                table: "Travelers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TravelAgent_Email",
                table: "TravelAgents",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Admin_Email",
                table: "Administrators",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Traveller_Email",
                table: "Travelers");

            migrationBuilder.DropColumn(
                name: "TravelAgent_Email",
                table: "TravelAgents");

            migrationBuilder.DropColumn(
                name: "Admin_Email",
                table: "Administrators");
        }
    }
}
