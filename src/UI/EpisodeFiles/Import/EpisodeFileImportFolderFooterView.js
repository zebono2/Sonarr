'use strict';
define(
    [
        'underscore',
        'vent',
        'marionette'
    ], function (_,
                 vent,
                 Marionette) {
        return Marionette.ItemView.extend({
            template: 'EpisodeFiles/Import/EpisodeFileImportFolderFooterViewTemplate',

            events: {
                'click .x-delete-folder' : '_deleteFolder'
            },

            _deleteFolder: function (options) {
                window.alert('Delete:' + options.model.get('name'));
            }
        });
    });
