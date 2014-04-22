using System;
using System.Collections.Generic;
using NzbDrone.Core.Datastore;
using NzbDrone.Core.Qualities;

namespace NzbDrone.Core.MediaFiles.EpisodeImport.DroneFactory
{
    public abstract class DroneFactoryItemBase : ModelBase
    {
        public abstract DroneFactoryType Type { get; }
        public String Name { get; set; }
        public String Path { get; set; }
        public Int64 Size { get; set; }
        public Int32 SeriesId { get; set; }
        public List<String> RejectionReasons { get; set; }
        public QualityModel Quality { get; set; }

        protected DroneFactoryItemBase()
        {
            RejectionReasons = new List<string>();
        }
    }

    public enum DroneFactoryType
    {
        File,
        Folder
    }
}
