using ExcursionSaaS.Application.Interfaces.Organisations;
using ExcursionSaaS.Application.Interfaces.Storage;

namespace ExcursionSaaS.Application.Services
{
    public class LogoService : ILogoService
    {
        #region Constants and Constructor
        private const long MaxLogoSizeInBytes = 2 * 1024 * 1024; // 2 MB
        private readonly ILogoStorage _logoStorage;
        
        public LogoService(ILogoStorage logoStorage)
        {
            _logoStorage = logoStorage;
        }
        #endregion

        #region Public Methods
        public async Task<string> UploadLogoAsync(Stream content, CancellationToken cancellationToken)
        {
            using var buffer = new MemoryStream();
            await content.CopyToAsync(buffer, cancellationToken);

            if (buffer.Length == 0)
                throw new InvalidOperationException("Logo content is empty");
            if (buffer.Length > MaxLogoSizeInBytes)
                throw new InvalidOperationException($"Logo size exceeds the maximum allowed size of 2MB");

            var extension = DetectException(buffer.GetBuffer(), (int)buffer.Length)
                ?? throw new InvalidOperationException("Unsupported logo format. Only PNG, JPG, and WEBP are allowed.");
            buffer.Position = 0;
            return await _logoStorage.SaveAsync(buffer, extension, cancellationToken);
        }
        #endregion

        #region Helper Methods
        private static string? DetectException(byte[] data, int length)
        {
            if (length >= 8 && data[0] == 0x89 && data[1] == 0x50 && data[2] == 0x4E && data[3] == 0x47
                && data[4] == 0x0D && data[5] == 0x0A && data[6] == 0x1A && data[7] == 0x0A)
                return ".png";

            if (length >= 3 && data[0] == 0xFF && data[1] == 0xD8 && data[2] == 0xFF)
                return ".jpg";

            if (length >= 12 && data[0] == 'R' && data[1] == 'I' && data[2] == 'F' && data[3] == 'F'
                && data[8] == 'W' && data[9] == 'E' && data[10] == 'B' && data[11] == 'P')
                return ".webp";

            return null;
        }
        #endregion
    }
}
