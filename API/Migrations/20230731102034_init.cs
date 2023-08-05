using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BigBangTravelPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Administrators",
                columns: table => new
                {
                    Admin_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Admin_Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Admin_Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Administrators", x => x.Admin_Id);
                });

            migrationBuilder.CreateTable(
                name: "Travelers",
                columns: table => new
                {
                    Traveller_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "201, 1"),
                    Traveller_Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Traveller_Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Travelers", x => x.Traveller_Id);
                });

            migrationBuilder.CreateTable(
                name: "TravelAgents",
                columns: table => new
                {
                    TravelAgent_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "101, 1"),
                    TravelAgent_Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TravelAgent_Password = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TravelAgent_IsApproved = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AdministratorAdmin_Id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TravelAgents", x => x.TravelAgent_Id);
                    table.ForeignKey(
                        name: "FK_TravelAgents_Administrators_AdministratorAdmin_Id",
                        column: x => x.AdministratorAdmin_Id,
                        principalTable: "Administrators",
                        principalColumn: "Admin_Id");
                });

            migrationBuilder.CreateTable(
                name: "TourPackages",
                columns: table => new
                {
                    TourPackage_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "301, 1"),
                    TourPackage_Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TourPackage_Location = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TourPackage_HotelName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TourPackage_PricePerDay = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Location_Speciality = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Spots_Nearby = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Location_Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Hotel_Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TravelAgent_Id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourPackages", x => x.TourPackage_Id);
                    table.ForeignKey(
                        name: "FK_TourPackages_TravelAgents_TravelAgent_Id",
                        column: x => x.TravelAgent_Id,
                        principalTable: "TravelAgents",
                        principalColumn: "TravelAgent_Id");
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Booking_Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "401, 1"),
                    Booking_Date = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Booking_TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TravelerTraveller_Id = table.Column<int>(type: "int", nullable: true),
                    TourPackage_Id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Booking_Id);
                    table.ForeignKey(
                        name: "FK_Bookings_TourPackages_TourPackage_Id",
                        column: x => x.TourPackage_Id,
                        principalTable: "TourPackages",
                        principalColumn: "TourPackage_Id");
                    table.ForeignKey(
                        name: "FK_Bookings_Travelers_TravelerTraveller_Id",
                        column: x => x.TravelerTraveller_Id,
                        principalTable: "Travelers",
                        principalColumn: "Traveller_Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_TourPackage_Id",
                table: "Bookings",
                column: "TourPackage_Id");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_TravelerTraveller_Id",
                table: "Bookings",
                column: "TravelerTraveller_Id");

            migrationBuilder.CreateIndex(
                name: "IX_TourPackages_TravelAgent_Id",
                table: "TourPackages",
                column: "TravelAgent_Id");

            migrationBuilder.CreateIndex(
                name: "IX_TravelAgents_AdministratorAdmin_Id",
                table: "TravelAgents",
                column: "AdministratorAdmin_Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "TourPackages");

            migrationBuilder.DropTable(
                name: "Travelers");

            migrationBuilder.DropTable(
                name: "TravelAgents");

            migrationBuilder.DropTable(
                name: "Administrators");
        }
    }
}
