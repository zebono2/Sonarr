using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.UI;
using NLog;
using NzbDrone.Common;
using NzbDrone.Common.Disk;
using NzbDrone.Core.Configuration;
using NzbDrone.Core.Parser;
using NzbDrone.Core.Parser.Model;
using NzbDrone.Core.Tv;

namespace NzbDrone.Core.MediaFiles.EpisodeImport.DroneFactory
{
    public interface IDroneFactoryService
    {
        List<DroneFactoryItemBase> GetContents();
    }

    public class DroneFactoryService : IDroneFactoryService
    {
        private readonly IConfigService _configService;
        private readonly IDiskProvider _diskProvider;
        private readonly IParsingService _parsingService;
        private readonly IMakeImportDecision _importDecisionMaker;
        private readonly IDiskScanService _diskScanService;
        private readonly Logger _logger;

        public DroneFactoryService(IConfigService configService,
            IDiskProvider diskProvider,
            IParsingService parsingService,
            IMakeImportDecision importDecisionMaker,
            IDiskScanService diskScanService,
            Logger logger)
        {
            _configService = configService;
            _diskProvider = diskProvider;
            _parsingService = parsingService;
            _importDecisionMaker = importDecisionMaker;
            _diskScanService = diskScanService;
            _logger = logger;
        }

        public List<DroneFactoryItemBase> GetContents()
        {
            var downloadedEpisodesFolder = _configService.DownloadedEpisodesFolder;

            if (downloadedEpisodesFolder.IsNullOrWhiteSpace())
            {
                _logger.Warn("Drone factory folder has not been set");
                return new List<DroneFactoryItemBase>();
            }

            if (!_diskProvider.FolderExists(downloadedEpisodesFolder))
            {
                _logger.Warn("Drone factory folder does not exist");
                return new List<DroneFactoryItemBase>();
            }

            var result = new List<DroneFactoryItemBase>();

            result.AddRange(GetFolders(downloadedEpisodesFolder));
            result.AddRange(GetFiles(downloadedEpisodesFolder, SearchOption.TopDirectoryOnly));

            return result;
        }

        private IEnumerable<Folder> GetFolders(string path)
        {
            var folders = _diskProvider.GetDirectories(path);

            foreach (var folder in folders)
            {
                var directoryInfo = new DirectoryInfo(folder);
                var series = _parsingService.GetSeries(directoryInfo.Name);

                var folderResult = new Folder
                             {
                                 Id = directoryInfo.FullName.GetHashCode(),
                                 Name = directoryInfo.Name,
                                 Path = directoryInfo.FullName,
                                 Files = GetFiles(directoryInfo.FullName, SearchOption.AllDirectories).ToList(),
                                 Size = _diskProvider.GetFolderSize(directoryInfo.FullName),
                                 Quality = QualityParser.ParseQuality(directoryInfo.Name)
                             };

                if (series != null)
                {
                    folderResult.SeriesId = series.Id;
                }

                else
                {
                    folderResult.RejectionReasons.Add("Unknown Series");
                }

                yield return folderResult;
            }
        }

        private IEnumerable<File> GetFiles(string path, SearchOption searchOption, Series series = null)
        {
            var files = _diskProvider.GetFiles(path, searchOption);
            var videoFiles = _diskScanService.GetVideoFiles(path, searchOption == SearchOption.AllDirectories).ToList();
            
            foreach (var file in files)
            {
                var fileInfo = new FileInfo(file);

                if (series == null)
                {
                    series = _parsingService.GetSeries(fileInfo.Name);
                }

                ImportDecision importDecision = null;

                var fileResult =  new File
                {
                    Id = fileInfo.FullName.GetHashCode(),
                    Name = fileInfo.Name,
                    Path = fileInfo.FullName,
                    Size = _diskProvider.GetFileSize(fileInfo.FullName),
                    SeriesId = series != null ? series.Id : 0,
                    Quality = QualityParser.ParseQuality(fileInfo.Name)
                };

                if (series != null)
                {
                    importDecision = _importDecisionMaker.GetImportDecisions(new List<String> { file }, series, true, null).First();
                }

                else
                {
                    fileResult.RejectionReasons.Add("Unknown Series");
                }

                if (!videoFiles.Any(v => v == file))
                {
                    fileResult.RejectionReasons.Add("Not a video file");
                }

                if (importDecision != null)
                {
                    fileResult.RejectionReasons = importDecision.Rejections.ToList();
                    fileResult.EpisodeIds = importDecision.LocalEpisode.Episodes.Select(e => e.Id).ToList();
                }

                yield return fileResult;
            }
        }
    }
}
