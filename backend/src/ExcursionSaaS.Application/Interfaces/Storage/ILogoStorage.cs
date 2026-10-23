using System;
using System.Collections.Generic;
using System.Text;

namespace ExcursionSaaS.Application.Interfaces.Storage
{
    public interface ILogoStorage
    {
        Task<string> SaveAsync(Stream content, string extension, CancellationToken cancellationToken);
    }
}
