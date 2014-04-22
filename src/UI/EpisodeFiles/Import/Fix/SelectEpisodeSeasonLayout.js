'use strict';
define(
    [
        'marionette',
        'backgrid'
    ], function (Marionette, Backgrid) {

        return Marionette.Layout.extend({
            template: 'EpisodeFiles/Import/Fix/SelectEpisodeSeasonLayoutTemplate',

            regions: {
                episodes : '.x-episodes'
            },

            ui: {
                episodes: '.x-episodes'
            },

            events: {
                'click .x-season': '_toggleEpisodes'
            },

            columns: [
                {
                    name      : '',
                    cell      : 'select-row',
                    headerCell: 'select-all',
                    sortable  : false
                },
                {
                    name  : 'title',
                    label : 'Title',
                    cell  : 'string'
                },
                {
                    name  : 'seasonNumber',
                    label : 'Season',
                    cell  : 'integer'
                },
                {
                    name  : 'episodeNumber',
                    label : 'Episode',
                    cell  : 'integer'
                }
            ],

            initialize: function (options) {

                if (!options.episodeCollection) {
                    throw 'episodeCollection is needed';
                }

                this.episodeCollection = options.episodeCollection.bySeason(this.model.get('seasonNumber'));
                this.series = options.series;
            },

            onRender: function () {
                this.episodesGrid = new Backgrid.Grid({
                    collection: this.episodeCollection,
                    columns   : this.columns,
                    className : 'table table-hover'
                });

                this.episodes.show(this.episodesGrid);
                this.ui.episodes.hide();
            },

            _toggleEpisodes: function () {
                this.ui.episodes.toggle();
            },

            getSelectedEpisodes: function () {
                return this.episodesGrid.getSelectedModels();
            }
        });
    });
