using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Events;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<Event>
    {
        public void Configure(EntityTypeBuilder<Event> builder)
        {
            builder.ToTable("Event");

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Name).IsRequired().HasMaxLength(150);
            builder.Property(e => e.StartDate).IsRequired();
            builder.Property(e => e.EndDate).IsRequired();
            builder.Property(e => e.Status).HasDefaultValue(EventStatus.Active);

            builder.HasOne(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(e => e.Organisation)
                .WithMany(o => o.Events)
                .HasForeignKey(e => e.OrganisationId)
                .OnDelete(DeleteBehavior.Cascade);

            // Ubrzava racunanje Total/Active eventa po organizaciji.
            builder.HasIndex(e => new { e.OrganisationId, e.Status, e.EndDate });
        }
    }
}