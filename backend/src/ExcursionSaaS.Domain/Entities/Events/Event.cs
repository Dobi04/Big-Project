using ExcursionSaaS.Domain.Enums.Events;

namespace ExcursionSaaS.Domain.Entities
{
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public int OwnerId { get; set; }
        public User Owner { get; set; } = null!;

        public int OrganisationId { get; set; }
        public Organisation Organisation { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public EventStatus Status { get; set; } = EventStatus.Active;
    }
}
