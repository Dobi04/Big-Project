using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExcursionSaaS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class DodajEmailVerifikaciju : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<bool>(
                name: "isEmailVerified",
                table: "User",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerificationCode",
                table: "User");

            migrationBuilder.DropColumn(
                name: "EmailVerificationCodeExpiry",
                table: "User");

            migrationBuilder.DropColumn(
                name: "isEmailVerified",
                table: "User");
        }
    }
}
