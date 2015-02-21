using System;
using NzbDrone.Common.Http;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Parser;
using NLog;
namespace NzbDrone.Core.Indexers.Torrentrrs
{
public class Torrentrrs : HttpIndexerBase<TorrentrrsSettings>
{
public override DownloadProtocol Protocol { get { return DownloadProtocol.Torrent; } }
public override Boolean SupportsSearch { get { return false; } }
public override Int32 PageSize { get { return 0; } }
public Torrentrrs(IHttpClient httpClient, IConfigService configService, IParsingService parsingService, Logger logger)
: base(httpClient, configService, parsingService, logger)
{
}
public override IIndexerRequestGenerator GetRequestGenerator()
{
return new TorrentrrsRequestGenerator() { Settings = Settings };
}
public override IParseIndexerResponse GetParser()
{
return new TorrentRssParser() { ParseSizeInDescription = true };
}
}
}
