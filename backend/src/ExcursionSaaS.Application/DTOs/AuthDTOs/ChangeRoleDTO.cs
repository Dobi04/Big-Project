using System.ComponentModel.DataAnnotations;

namespace ExcursionSaaS.Application.DTOs.AuthDTOs
{
    public class ChangeRoleDTO
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
