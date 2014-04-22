'use strict';
define(
    [
        'underscore',
        'vent',
        'backgrid'
    ], function (_, vent, Backgrid) {

        return Backgrid.Row.extend({
            className: 'episode-file-import-row',

            events: {
                'click': '_selectRow'
            },

            _originalInit: Backgrid.Row.prototype.initialize,

            initialize: function () {
                this._originalInit.apply(this, arguments);

                this.selected = false;
                this.listenTo(vent, vent.Events.EpisodeFileImportSelected, this._rowSelected);
            },

            _selectRow: function () {
                this.selected = true;
                this.$el.addClass('info');

                vent.trigger(vent.Events.EpisodeFileImportSelected, { model: this.model });
            },

            _rowSelected: function (options) {
                var model = options.model;

                if (!_.isEqual(model, this.model)) {
                    this.selected = false;
                    this.$el.removeClass('info');
                }
            }
        });
    });
