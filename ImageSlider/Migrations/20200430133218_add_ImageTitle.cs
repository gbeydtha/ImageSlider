using Microsoft.EntityFrameworkCore.Migrations;

namespace ImageSlider.Migrations
{
    public partial class add_ImageTitle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageTitle",
                table: "GalleryImages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageTitle",
                table: "GalleryImages");
        }
    }
}
