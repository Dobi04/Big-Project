using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExcursionSaaS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class VerificationAttemptLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FailedVerificationAttempts",
                table: "PendingUserRegistration",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastCodeSentAt",
                table: "PendingUserRegistration",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            migrationBuilder.AddColumn<int>(
                name: "ResendCount",
                table: "PendingUserRegistration",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FailedVerificationAttempts",
                table: "PendingUserRegistration");

            migrationBuilder.DropColumn(
                name: "LastCodeSentAt",
                table: "PendingUserRegistration");

            migrationBuilder.DropColumn(
                name: "ResendCount",
                table: "PendingUserRegistration");
        }
    }
}
