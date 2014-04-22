using System;
using System.Collections.Generic;
using NzbDrone.Api.REST;
using NzbDrone.Core.MediaFiles.EpisodeImport.DroneFactory;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Api.EpisodeFiles.Import
{
    public class EpisodeFileImportResource : RestResource
    {
        public DroneFactoryType Type { get; set; }
        public String Name { get; set; }
        public String Path { get; set; }
        public Int64 Size { get; set; }
        public List<File> Files { get; set; }
        public Int32 SeriesId { get; set; }
        public List<String> RejectionReasons { get; set; }
        public List<Int32> EpisodeIds { get; set; }
        public QualityModel Quality { get; set; }

        public EpisodeFileImportResource()
        {
            RejectionReasons = new List<string>();
        }
    }
}
