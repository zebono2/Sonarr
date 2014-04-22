'use strict';
define(
    [
        'underscore',
        'jquery',
        'vent',
        'marionette',
        'Series/SeriesCollection',
        'Series/EpisodeCollection',
        'EpisodeFiles/Import/Fix/SelectSeriesCollectionView',
        'EpisodeFiles/Import/Fix/SelectEpisodeLayout',
        'Shared/LoadingView',
        'Shared/Messenger'
    ], function (_, $, vent, Marionette, SeriesCollection, EpisodeCollection, SelectSeriesCollectionView, SelectEpisodeLayout, LoadingView, Messenger) {

        return Marionette.Layout.extend({
            template: 'EpisodeFiles/Import/Fix/EpisodeFileImportFixLayoutTemplate',

            regions: {
                contents : '#x-contents'
            },

            ui: {
                back   : '.x-back',
                import : '.x-import'
            },

            events: {
                'click .x-back'   : '_back',
                'click .x-import' : '_import'
            },

            initialize: function () {
                this.selectSeriesView = new SelectSeriesCollectionView({ collection: SeriesCollection });
                this.listenTo(this.selectSeriesView, 'itemview:seriesSelected', this._seriesSelected);
            },

            onShow: function () {
                if (this.model.get('seriesId') > 0) {
                    this._showSelectEpisode(this.model.get('seriesId'));
                }

                else {
                    this._showSelectSeries();
                }
            },

            _back: function () {
                this._showSelectSeries();
            },

            _showSelectSeries: function () {
                this.ui.back.hide();
                this.ui.import.hide();
                this.contents.show(this.selectSeriesView);
            },

            _showSelectEpisode: function (seriesId) {
                var self = this;

                this.contents.show(new LoadingView());

                this.series = SeriesCollection.get(seriesId);
                this.episodeCollection = new EpisodeCollection({ seriesId: seriesId  });
                this.episodeCollection.fetch();

                this.ui.back.show();
                this.ui.import.show();

                this.listenTo(this.episodeCollection, 'sync', function () {
                    self.selectEpisodeLayout = new SelectEpisodeLayout({ model: this.series, episodeCollection: this.episodeCollection });
                    self.contents.show(self.selectEpisodeLayout);
                });
            },

            _seriesSelected: function (options) {
                this._showSelectEpisode(options.model.get('id'));
            },

            _import: function () {

                var self = this;
                var seriesId = this.series.get('id');
                var selectedEpisodes = this.selectEpisodeLayout.getSelectedEpisodes();

                if (selectedEpisodes.length === 0) {
                    Messenger.show({
                        message : 'No episodes selected',
                        type    : 'error'
                    });

                    return;
                }

                this.model.set({
                    seriesId: seriesId,
                    episodeIds: _.pluck(selectedEpisodes, 'id')
                });

                var promise = $.ajax({
                    url: window.NzbDrone.ApiRoot + '/episodefile/import',
                    type: 'POST',
                    data: JSON.stringify(this.model.toJSON())
                });

                promise.done(function () {
                    self.model.collection.remove(self.model);
                    vent.trigger(vent.Commands.CloseModalCommand);
                });
            }
        });
    });
