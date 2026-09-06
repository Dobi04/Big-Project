using ExcursionSaaS.Domain.Entities;
using ExcursionSaaS.Domain.Enums.Organisations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ExcursionSaaS.Infrastructure.Persistence.Configurations
{
    public class OrganisationMemberConfiguration : IEntityTypeConfiguration<OrganisationMember>
    {
        public void Configure(EntityTypeBuilder<OrganisationMember> builder)
        {
            builder.ToTable("OrganisationMember");

            builder.HasKey(m => m.Id);

            builder.Property(m => m.Role)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired()
                .HasDefaultValue(OrganisationMemberRole.Participant);

            builder.Property(m => m.PaymentStatus)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired()
                .HasDefaultValue(MemberSubscriptionStatus.Free);

            builder.Property(m => m.JoinedAt).IsRequired();

            builder.HasOne(m => m.Organisation)
                .WithMany(o => o.Members)
                .HasForeignKey(m => m.OrganisationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(m => m.Member)
                .WithMany()
                .HasForeignKey(m => m.MemberId)
                .OnDelete(DeleteBehavior.Cascade);

            // Jedan korisnik moze biti clan iste organizacije samo jednom.
            builder.HasIndex(m => new { m.OrganisationId, m.MemberId }).IsUnique();
        }
    }
}