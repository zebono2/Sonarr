'use strict';
define(
    [
        'underscore',
        'vent',
        'marionette',
        'backgrid',
        'EpisodeFiles/Import/EpisodeFileImportCollection',
        'EpisodeFiles/Import/EpisodeFileImportTypeCell',
        'EpisodeFiles/Import/EpisodeFileImportFixCell',
        'Cells/FileSizeCell',
        'Cells/ApprovalStatusCell',
        'Series/SeriesCollection',
        'Shared/LoadingView',
        'EpisodeFiles/Import/EpisodeFileImportFolderFooterView',
        'EpisodeFiles/Import/EpisodeFileImportRow'
    ], function (_,
                 vent,
                 Marionette,
                 Backgrid,
                 EpisodeFileImportCollection,
                 EpisodeFileImportTypeCell,
                 EpisodeFileImportFixCell,
                 FileSizeCell,
                 ApprovalStatusCell,
                 SeriesCollection,
                 LoadingView,
                 FolderFooterView,
                 Row) {

        return Marionette.Layout.extend({
            template: 'EpisodeFiles/Import/EpisodeFileImportLayoutTemplate',

            regions: {
                contents : '#x-contents'
            },

            columns:
                [
                    {
                        name     : 'type',
                        label    : '',
                        cell     : EpisodeFileImportTypeCell,
                        sortable : false
                    },
                    {
                        name : 'name',
                        label: 'Name',
                        cell : 'string'
                    },
                    {
                        name : 'size',
                        label: 'Size',
                        cell : FileSizeCell
                    },
                    {
                        name : 'rejectionReasons',
                        label: '',
                        cell : ApprovalStatusCell
                    },
                    {
                        name : 'type',
                        label: '',
                        cell : EpisodeFileImportFixCell
                    }
                ],

            initialize: function () {
                this.collection = new EpisodeFileImportCollection();
                this.listenTo(this.collection, 'sync', this._showTable);
                this.listenTo(vent, vent.Events.EpisodeFileImportSelected, this._selected);
            },

            onShow: function () {
                this.contents.show(new LoadingView());
                this.collection.fetch();
                //this._showFooter();

                //Show footer with options to clear empty folders, refresh
            },

            _showTable: function (collection) {

                this.contents.show(new Backgrid.Grid({
                    row        : Row,
                    columns    : this.columns,
                    collection : collection,
                    className  : 'table table-hover'
                }));
            },

            _showFooter: function (view) {
                vent.trigger(vent.Commands.OpenControlPanelCommand, view);
            },

            _selected: function (options) {

                var model = options.model;

                if (model.get('type') === 'parent') {
                    this._showTable(this.collection);
                    vent.trigger(vent.Commands.CloseControlPanelCommand);
                }

                else if (model.get('type') === 'folder') {

                    var files = model.get('files');

                    if (!_.any(files, { type: 'parent' })) {
                        files.unshift({
                            type: 'parent',
                            name: '...'
                        });
                    }

                    var collection = new EpisodeFileImportCollection(files);
                    this.listenTo(collection, 'remove', function () {
                        model.set('files', collection.toJSON());
                    });

                    this._showTable(collection);
                    this._showFooter(new FolderFooterView({ model: model }));
                }
            }
        });
    });
