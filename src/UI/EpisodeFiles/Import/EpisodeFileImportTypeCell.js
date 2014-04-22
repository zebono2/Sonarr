'use strict';

define(
    [
        'vent',
        'Cells/NzbDroneCell'
    ], function (vent, NzbDroneCell) {
        return NzbDroneCell.extend({

            className: 'episode-file-import-type-cell',

            render: function () {
                this.$el.empty();

                var type = this.model.get(this.column.get('name'));

                if (type === 'parent') {
                    this.$el.html('<i class="icon-level-up"></i>');
                }

                else if (type === 'folder') {
                    this.$el.html('<i class="icon-folder-close"></i>');
                }

                else {
                    this.$el.html('<i class="icon-file"></i>');
                }

                this.delegateEvents();
                return this;
            }
        });
    });
