using System;
using FluentValidation;
using FluentValidation.Results;
using NzbDrone.Core.Annotations;
using NzbDrone.Core.ThingiProvider;
using NzbDrone.Core.Validation;

namespace NzbDrone.Core.Metadata.Consumers.MediaBrowser
{
    public class MediaBrowserSettingsValidator : NzbDroneValidator<MediaBrowserMetadataSettings>
    {
        public MediaBrowserSettingsValidator()
        {
        }
    }

    public class MediaBrowserMetadataSettings : IProviderConfig
    {
        private static readonly MediaBrowserSettingsValidator Validator = new MediaBrowserSettingsValidator();

        public MediaBrowserMetadataSettings()
        {
            SeriesMetadata = true;
        }

        [FieldDefinition(0, Label = "Series Metadata", Type = FieldType.Checkbox)]
        public Boolean SeriesMetadata { get; set; }

        public bool IsValid
        {
            get
            {
                return true;
            }
        }

        public ValidationResult Validate()
        {
            return Validator.Validate(this);
        }
    }
}
