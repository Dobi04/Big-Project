using ExcursionSaaS.Application.Interfaces.Storage;
using Microsoft.Extensions.Configuration;

namespace ExcursionSaaS.Infrastructure.Storage
{
    public class LocalLogoStorage : ILogoStorage
    {
        #region Constructor
        private readonly IConfiguration _configuration;

        public LocalLogoStorage(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        #endregion

        #region StorageOperations
        public async Task<string> SaveAsync(Stream content, string extension, CancellationToken cancellationToken)
        {
            var root = _configuration["Uploads:Path"]
               ?? throw new InvalidOperationException("Uploads:Path is not configured.");

            var folder = Path.Combine(root, "logos");
            Directory.CreateDirectory(folder);

            var fileName = $"{Guid.NewGuid():N}{extension}";
            await using var file = new FileStream(Path.Combine(folder, fileName), FileMode.CreateNew, FileAccess.Write);
            await content.CopyToAsync(file, cancellationToken);

            return $"/api/uploads/logos/{fileName}";
        }
        #endregion
    }
}
