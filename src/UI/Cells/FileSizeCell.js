'use strict';

define(
    [
        'backgrid',
        'Shared/FormatHelpers'
    ], function (Backgrid, FormatHelpers) {
        return Backgrid.Cell.extend({

            className: 'file-size-cell',

            render: function () {
                var name = this.column.get('name');

                if (this.model.has(name)) {
                    var size = this.model.get(name);
                    this.$el.html(FormatHelpers.bytes(size));
                }

                else {
                    this.$el.html('-');
                }

                this.delegateEvents();
                return this;
            }
        });
    });
