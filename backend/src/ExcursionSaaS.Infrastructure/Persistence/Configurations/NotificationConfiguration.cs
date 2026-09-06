using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Notifications;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("Notification");

            builder.HasKey(n => n.Id);

            builder.Property(n => n.Type)
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired()
                .HasDefaultValue(NotificationType.General);

            builder.Property(n => n.Message).HasMaxLength(500).IsRequired();
            builder.Property(n => n.IsRead).IsRequired().HasDefaultValue(false);
            builder.Property(n => n.CreatedAt).IsRequired();

            builder.HasOne(n => n.Recipient)
                .WithMany()
                .HasForeignKey(n => n.RecipientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(n => n.Organisation)
                .WithMany()
                .HasForeignKey(n => n.OrganisationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ubrzava "daj mi nepročitane notifikacije za ovog korisnika".
            builder.HasIndex(n => new { n.RecipientId, n.IsRead });
        }
    }
}
