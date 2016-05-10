define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _angular2now = angular2now;
    var SetModule = _angular2now.SetModule;
    var Service = _angular2now.Service;
    var Inject = _angular2now.Inject;

    SetModule('App');

    var DBCache = (function () {
        function DBCache($q, modernizr) {
            _classCallCheck(this, _DBCache);

            this.$q = $q;
            this.modernizr = modernizr;

            if (this.supported) this.setup();
        }

        _createClass(DBCache, [{
            key: 'setup',
            value: function setup() {
                if (this._db === undefined) {
                    var tmpdb = new window.Dexie("fx");
                    tmpdb.version(1).stores({
                        cachedQueries: "key",
                        cachedQueriesByType: "++id,entityType,key"
                    });
                    tmpdb.on('error', function (err) {
                        // Log to console or show en error alert somewhere in your GUI...
                        console.log("Dexie error: " + err);
                    });
                    this._db = tmpdb;
                }
                if (!this._db.isOpen()) this._db.open();
            }
        }, {
            key: 'getItem',
            value: function getItem(key) {
                if (!this.supported) return this.$q.when(undefined);

                return this.$q.when(this.db.cachedQueries.get(key.toLowerCase()).then(function (item) {
                    if (item !== undefined) return item.value;
                    return undefined;
                }))['catch'](function (err) {
                    // Always end with a final .catch() so you don't miss out any error
                    console.error(err);
                });
            }
        }, {
            key: 'setItem',
            value: function setItem(key, value) {
                if (!this.supported) return this.$q.when(true);

                return this.$q.when(this.db.cachedQueries.put({ key: key.toLowerCase(), value: value })['catch'](function (err) {
                    // Always end with a final .catch() so you don't miss out any error
                    console.error(err);
                }));
            }
        }, {
            key: 'getKeys',
            value: function getKeys() {
                if (!this.supported) return this.$q.when([]);

                return this.$q.when(this.db.cachedQueries.toArray().then(function (items) {
                    var arr = [];
                    items.forEach(function (item) {
                        arr.push(item.key);
                    });
                    return arr;
                })['catch'](function (err) {
                    // Always end with a final .catch() so you don't miss out any error
                    console.error(err);
                }));
            }
        }, {
            key: 'removeItem',
            value: function removeItem(key) {
                if (!this.supported) return this.$q.when(true);
                return this.$q.when(this.db.cachedQueries['delete'](key.toLowerCase())['catch'](function (err) {
                    // Always end with a final .catch() so you don't miss out any error
                    console.error(err);
                }));
            }
        }, {
            key: 'clear',
            value: function clear() {
                if (!this.supported) return this.$q.when(true);

                var arr = [];
                this.db.tables.forEach(function (table) {
                    arr.push(table.clear());
                });
                return this.$q.all(arr).then(function (result) {
                    return true;
                });
            }
        }, {
            key: 'supported',
            get: function get() {
                return this.modernizr.indexeddb && this.modernizr.localstorage && !/(iPad|iPhone|iPod)/g.test(navigator.userAgent);
            }
        }, {
            key: 'db',
            get: function get() {
                this.setup();
                return this._db;
            }
        }]);

        var _DBCache = DBCache;
        DBCache = Inject(['$q', 'Modernizr'])(DBCache) || DBCache;
        DBCache = Service('dbCache')(DBCache) || DBCache;
        return DBCache;
    })();

    exports.DBCache = DBCache;
});
