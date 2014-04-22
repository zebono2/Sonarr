'use strict';

define(
    [
        'jquery',
        'vent',
        'Cells/NzbDroneCell',
        'EpisodeFiles/Import/Fix/EpisodeFileImportFixLayout'
    ], function ($, vent, NzbDroneCell, FixLayout) {
        return NzbDroneCell.extend({

            className: 'episode-file-import-fix-cell',

            events: {
                'click .x-fix'    : '_fix',
                'click .x-delete' : '_delete'
            },

            render: function () {
                this.$el.empty();

                this.type = this.model.get(this.column.get('name'));

                var contents = '';

                if (this.type !== 'parent') {
                    contents += '<i class="icon-nd-delete x-delete" title="Delete"></i>';
                }

                if (this.type === 'file') {
                    contents += '<i class="icon-wrench fix x-fix" title="Fix it"></i>';
                }

                this.$el.html(contents);

                this.delegateEvents();
                return this;
            },

            _fix: function (e) {
                e.preventDefault();
                e.stopPropagation();

                vent.trigger(vent.Commands.OpenModalCommand, new FixLayout({ model: this.model }));
            },

            _delete: function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = this;

                var promise = $.ajax({
                    url: window.NzbDrone.ApiRoot + '/episodefile/import/delete',
                    type: 'POST',
                    data: JSON.stringify(this.model.toJSON())
                });

                promise.done(function () {
                    self.model.collection.remove(self.model);
                });
            }
        });
    });
