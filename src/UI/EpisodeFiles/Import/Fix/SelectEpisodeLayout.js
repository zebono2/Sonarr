'use strict';
define(
    [
        'marionette',
        'backgrid',
        'Series/SeasonCollection',
        'EpisodeFiles/Import/Fix/SelectEpisodeSeasonCollectionView'
    ], function (Marionette, Backgrid, SeasonCollection, SeasonCollectionView) {

        return Marionette.Layout.extend({
            template: 'EpisodeFiles/Import/Fix/SelectEpisodeLayoutTemplate',

            regions: {
                seasons : '#x-seasons'
            },

            initialize: function (options) {

                if (!options.episodeCollection) {
                    throw 'episodeCollection is needed';
                }

                this.episodeCollection = options.episodeCollection;
                this.seasonCollection = new SeasonCollection(this.model.get('seasons'));
                this.series = this.model;
            },

            onRender: function () {
                this.seasonCollectionView = new SeasonCollectionView({
                    collection        : this.seasonCollection,
                    episodeCollection : this.episodeCollection,
                    series            : this.series
                });

                this.seasons.show(this.seasonCollectionView);
            },

            getSelectedEpisodes: function () {
                return this.seasonCollectionView.getSelectedEpisodes();
            }
        });
    });
