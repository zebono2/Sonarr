using System.Collections.Generic;
using Nancy;
using NzbDrone.Api.Extensions;
using NzbDrone.Common.Disk;
using NzbDrone.Core.MediaFiles.EpisodeImport;
using NzbDrone.Core.MediaFiles.EpisodeImport.DroneFactory;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.Tv;

namespace NzbDrone.Api.EpisodeFiles.Import
{
    public class EpisodeFileImportModule : NzbDroneRestModule<EpisodeFileImportResource>
    {
        private readonly IDroneFactoryService _droneFactoryService;
        private readonly ISeriesService _seriesService;
        private readonly IEpisodeService _episodeService;
        private readonly IImportApprovedEpisodes _approvedEpisodesImporter;
        private readonly IDiskProvider _diskProvider;

        public EpisodeFileImportModule(IDroneFactoryService droneFactoryService,
                                       ISeriesService seriesService,
                                       IEpisodeService episodeService,
                                       IImportApprovedEpisodes approvedEpisodesImporter,
                                       IDiskProvider diskProvider)
            : base("episodefile/import")
        {
            _droneFactoryService = droneFactoryService;
            _seriesService = seriesService;
            _episodeService = episodeService;
            _approvedEpisodesImporter = approvedEpisodesImporter;
            _diskProvider = diskProvider;

            GetResourceAll = GetAll;
            Post["/"] = x => Import();
            Post["/delete"] = x => DeleteItem();
        }

        private List<EpisodeFileImportResource> GetAll()
        {
            return ToListResource(_droneFactoryService.GetContents);
        }

        private Response Import()
        {
            var resource = Request.Body.FromJson<EpisodeFileImportResource>();

            var localEpisode = new LocalEpisode
                               {
                                   Path = resource.Path,
                                   Size = resource.Size,
                                   Series = _seriesService.GetSeries(resource.SeriesId),
                                   Episodes = _episodeService.GetEpisodes(resource.EpisodeIds),
                                   Quality = resource.Quality,
                                   ParsedEpisodeInfo = new ParsedEpisodeInfo { ReleaseGroup = "DRONE" }
                               };

            _approvedEpisodesImporter.Import(localEpisode, true);

            return resource.AsResponse();
        }

        private Response DeleteItem()
        {
            var resource = Request.Body.FromJson<EpisodeFileImportResource>();

            if (resource.Type == DroneFactoryType.Folder)
            {
                _diskProvider.DeleteFolder(resource.Path, true);
            }

            else
            {
                _diskProvider.DeleteFile(resource.Path);
            }

            return resource.AsResponse();
        }
    }
}
