'use strict';

define([
    'marionette',
    'EpisodeFiles/Import/Fix/SelectEpisodeSeasonLayout'
], function (Marionette, ItemView) {

    return Marionette.CollectionView.extend({
        itemView : ItemView,

        initialize: function (options) {

            if (!options.episodeCollection) {
                throw 'episodeCollection is needed';
            }

            this.episodeCollection = options.episodeCollection;
        },

        itemViewOptions: function () {
            return {
                episodeCollection: this.episodeCollection,
                series           : this.series
            };
        },

        getSelectedEpisodes: function () {
            var selected = [];

            this.children.each(function(view) {
                selected = selected.concat(view.getSelectedEpisodes());
            });

            return selected;
        }
    });
});
