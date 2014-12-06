using System;
using System.IO;
using NLog;
using NzbDrone.Common.Disk;

namespace NzbDrone.Update.UpdatePreflight
{
    public class CanWriteToTarget : IUpdatePreflightCheck
    {
        private readonly Logger _logger;
        private readonly IDiskProvider _diskProvider;

        public CanWriteToTarget(Logger logger, IDiskProvider diskProvider)
        {
            _logger = logger;
            _diskProvider = diskProvider;
        }

        public bool Check(string targetDir)
        {
            var files = _diskProvider.GetFiles(targetDir, SearchOption.AllDirectories);

            _diskProvider.
        }
    }

    public interface IUpdatePreflightCheck
    {
        bool Check(string targetDir);
    }
}