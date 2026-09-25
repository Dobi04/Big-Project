using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ExcursionSaaS.Application.DTOs.AuthDTOs
{
    public class ChangeRoleDTO
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
