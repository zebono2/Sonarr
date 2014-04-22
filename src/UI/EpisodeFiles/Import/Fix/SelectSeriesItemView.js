'use strict';

define([
    'AppLayout',
    'marionette'
], function (AppLayout, Marionette) {

    return Marionette.ItemView.extend({
        template: 'EpisodeFiles/Import/Fix/SelectSeriesItemViewTemplate',
        tagName : 'li',

        events: {
            'click': 'selectSeries'
        },

        selectSeries: function () {
            this.trigger('seriesSelected', { model: this.model});
        }
    });
});
