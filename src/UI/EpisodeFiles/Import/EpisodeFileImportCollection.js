'use strict';
define(
    [
        'backbone',
        'EpisodeFiles/Import/EpisodeFileImportModel'
    ], function (Backbone, EpisodeFileImportModel) {
        return Backbone.Collection.extend({
            url  : window.NzbDrone.ApiRoot + '/episodefile/import',
            model: EpisodeFileImportModel,

            state: {
                sortKey: 'name',
                order  : -1,
                pageSize: 100000
            }
        });
    });
