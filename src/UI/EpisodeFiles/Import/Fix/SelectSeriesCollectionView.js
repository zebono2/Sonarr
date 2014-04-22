'use strict';

define([
    'marionette',
    'EpisodeFiles/Import/Fix/SelectSeriesItemView'
], function (Marionette, ItemView) {

    return Marionette.CollectionView.extend({
        itemView : ItemView,
        tagName  : 'ul'
    });
});
