using System;
using System.Collections.Generic;

namespace NzbDrone.Core.MediaFiles.EpisodeImport.DroneFactory
{
    public class Folder : DroneFactoryItemBase
    {
        public override DroneFactoryType Type { get { return DroneFactoryType.Folder; } }
        public List<File> Files { get; set; }
    }
}
