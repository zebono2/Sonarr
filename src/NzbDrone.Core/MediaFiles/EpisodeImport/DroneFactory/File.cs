using System;
using System.Collections.Generic;

namespace NzbDrone.Core.MediaFiles.EpisodeImport.DroneFactory
{
    public class File : DroneFactoryItemBase
    {
        public override DroneFactoryType Type { get { return DroneFactoryType.File; } }
        public List<Int32> EpisodeIds { get; set; }
    }
}
