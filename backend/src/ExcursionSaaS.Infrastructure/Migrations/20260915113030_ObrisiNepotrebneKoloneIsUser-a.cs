using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExcursionSaaS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ObrisiNepotrebneKoloneIsUsera : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerificationCode",
                table: "User");

            migrationBuilder.DropColumn(
                name: "EmailVerificationCodeExpiry",
                table: "User");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Event",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Active",
                oldClrType: typeof(int),
                oldType: "int",
                oldDefaultValue: 0)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailVerificationCode",
                table: "User",
                type: "varchar(10)",
                maxLength: 10,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailVerificationCodeExpiry",
                table: "User",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Event",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldMaxLength: 20,
                oldDefaultValue: "Active")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
