var Geometry = require('../lib/geometry');
var Point = require('../lib/point');

var assert = require('assert');

describe('wkx', function () {
    describe('parseGeoJSON', function () {
        it('includes short CRS', function () {
            var point = new Point(1, 2);
            point.srid = 4326;

            assert.deepEqual(Geometry.parseGeoJSON({
                type: 'Point',
                crs: {
                    type: 'name',
                    properties: {
                        name: 'EPSG:4326'
                    }
                },
                coordinates: [1, 2]
            }), point);
        });
        it('includes long CRS', function () {
            var point = new Point(1, 2);
            point.srid = 4326;

            assert.deepEqual(Geometry.parseGeoJSON({
                type: 'Point',
                crs: {
                    type: 'name',
                    properties: {
                        name: 'urn:ogc:def:crs:EPSG::4326'
                    }
                },
                coordinates: [1, 2]
            }), point);
        });
        it('includes invalid CRS', function () {
            assert.throws(function () { Geometry.parseGeoJSON({
                    type: 'Point',
                    crs: {
                        type: 'name',
                        properties: {
                            name: 'TEST'
                        }
                    },
                    coordinates: [1, 2]
                });
            }, /Unsupported crs: TEST/);
        });
    });
    describe('toGeoJSON', function () {
        it('include short CRS', function () {
            var point = new Point(1, 2);
            point.srid = 4326;

            assert.deepEqual(point.toGeoJSON({ shortCrs: true }), {
                type: 'Point',
                crs: {
                    type: 'name',
                    properties: {
                        name: 'EPSG:4326'
                    }
                },
                coordinates: [1, 2]
            });
        });
        it('include long CRS', function () {
            var point = new Point(1, 2);
            point.srid = 4326;

            assert.deepEqual(point.toGeoJSON({ longCrs: true }), {
                type: 'Point',
                crs: {
                    type: 'name',
                    properties: {
                        name: 'urn:ogc:def:crs:EPSG::4326'
                    }
                },
                coordinates: [1, 2]
            });
        });
        it('geometry with SRID - without options', function () {
            var point = new Point(1, 2);
            point.srid = 4326;

            assert.deepEqual(point.toGeoJSON(), {
                type: 'Point',
                coordinates: [1, 2]
            });
        });
        it('geometry with SRID - with empty options', function () {
            var point = new Point(1, 2);
            point.srid = 4326;

            assert.deepEqual(point.toGeoJSON({}), {
                type: 'Point',
                coordinates: [1, 2]
            });
        });
    });
});
