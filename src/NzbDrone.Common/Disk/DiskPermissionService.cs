using System;
using System.IO;
using NLog;
using NzbDrone.Common.EnsureThat;

namespace NzbDrone.Common.Disk
{
    public class DiskPermissionService
    {
        private readonly IDiskProvider _diskProvider;
        private readonly Logger _logger;

        public DiskPermissionService(IDiskProvider diskProvider, Logger logger)
        {
            _diskProvider = diskProvider;
            _logger = logger;
        }

        public bool IsDirectoryWritable(string filePath)
        {
            Ensure.That(filePath, () => filePath).IsValidPath();

            if (!_diskProvider.FolderExists(filePath))
            {
                throw new DirectoryNotFoundException("Path doesn't exist " + filePath);
            }

            var tempFile = Path.Combine(filePath, Path.GetTempFileName());

            try
            {
                using (var fileStream = new FileStream(tempFile, FileMode.CreateNew, FileAccess.Write))
                {
                    fileStream.WriteByte(0xff);
                }

                File.Delete(tempFile);

                return true;

            }
            catch (Exception e)
            {
                _logger.WarnException("Couldn't write to " + filePath, e);
                return false;
            }
        }

        public bool IsFileWritable(string path)
        {
            Ensure.That(path, () => path).IsValidPath();

            if (!_diskProvider.FileExists(path))
            {
                throw new FileNotFoundException("File doesn't exist " + path);
            }

            try
            {
                using (File.Open(path, FileMode.Open, FileAccess.ReadWrite))
                {
                }
                return true;
            }
            catch (Exception e)
            {
                _logger.WarnException("Couldn't write to " + path, e);
                return false;
            }
        }
    }
}