namespace ExcursionSaaS.Application.Interfaces.Organisations
{
    public interface ILogoService
    {
        Task<string> UploadLogoAsync(Stream content, CancellationToken cancellationToken);
    }
}
