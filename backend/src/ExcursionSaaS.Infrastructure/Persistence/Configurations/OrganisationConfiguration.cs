using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Organisations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations
{
    public class OrganisationConfiguration : IEntityTypeConfiguration<Organisation>
    {
        public void Configure(EntityTypeBuilder<Organisation> builder)
        {
            builder.ToTable("Organisation");

            builder.HasKey(o => o.Id);

            builder.Property(o => o.OrganisationName).IsRequired().HasMaxLength(150);
            builder.Property(o => o.OrganisationDescription).IsRequired().HasMaxLength(1000);
            builder.Property(o => o.OrganisationLogo).HasMaxLength(500);
            builder.Property(o => o.Type).IsRequired().HasMaxLength(50).HasDefaultValue("NoneAdded");

            builder.Property(o => o.Visibility)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired()
                .HasDefaultValue(OrganisationVisibility.Private);

            builder.Property(o => o.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired()
                .HasDefaultValue(OrganisationStatus.Active);

            builder.Property(o => o.SubscriptionType)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();
            builder.Property(o => o.MonthlyPrice).HasColumnType("decimal(10,2)");
            builder.Property(o => o.YearlyPrice).HasColumnType("decimal(10,2)");


            builder.Property(o => o.AverageRating).HasColumnType("decimal(3,2)").HasDefaultValue(0m);
            builder.Property(o => o.RatingsCount).HasDefaultValue(0);

            builder.Property(o => o.CreatedAt).IsRequired();

            builder.HasOne(o => o.Owner)
                .WithMany()
                .HasForeignKey(o => o.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(o => o.OrganisationName);
            // Ubrzava GET /top upit (filter po Visibility+Status).
            builder.HasIndex(o => new { o.Visibility, o.Status });
        }
    }
}
