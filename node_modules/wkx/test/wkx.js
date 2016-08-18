/* jshint evil: true */

var Geometry = require('../lib/geometry');
var Point = require('../lib/point');
var LineString = require('../lib/linestring');
var Polygon = require('../lib/polygon');
var MultiPoint = require('../lib/multipoint');
var MultiLineString = require('../lib/multilinestring');
var MultiPolygon = require('../lib/multipolygon');
var GeometryCollection = require('../lib/geometrycollection');

var tests = {
    '2D': require('./testdata.json'),
    'Z': require('./testdataZ.json'),
    'M': require('./testdataM.json'),
    'ZM': require('./testdataZM.json')
};

var assert = require('assert');

function assertParseWkt(data) {
    assert.deepEqual(Geometry.parse(data.wkt), eval(data.geometry));
}

function assertParseWkb(data) {
    var geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
    geometry = eval(geometry);
    geometry.srid = undefined;
    assert.deepEqual(Geometry.parse(new Buffer(data.wkb, 'hex')), geometry);
}

function assertParseWkbXdr(data) {
    var geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
    geometry = eval(geometry);
    geometry.srid = undefined;
    assert.deepEqual(Geometry.parse(new Buffer(data.wkbXdr, 'hex')), geometry);
}

function assertParseEwkt(data) {
    var geometry = eval(data.geometry);
    geometry.srid = 4326;
    assert.deepEqual(Geometry.parse('SRID=4326;' + data.wkt), geometry);
}

function assertParseEwkb(data) {
    var geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
    geometry = eval(geometry);
    geometry.srid = 4326;
    assert.deepEqual(Geometry.parse(new Buffer(data.ewkb, 'hex')), geometry);
}

function assertParseEwkbXdr(data) {
    var geometry = data.wkbGeometry ? data.wkbGeometry : data.geometry;
    geometry = eval(geometry);
    geometry.srid = 4326;
    assert.deepEqual(Geometry.parse(new Buffer(data.ewkbXdr, 'hex')), geometry);
}

function assertParseTwkb(data) {
    var geometry = eval(data.geometry);
    geometry.srid = undefined;
    assert.deepEqual(Geometry.parseTwkb(new Buffer(data.twkb, 'hex')), geometry);
}

function assertParseGeoJSON(data) {
    var geometry = data.geoJSONGeometry ? data.geoJSONGeometry : data.geometry;
    geometry = eval(geometry);
    geometry.srid = undefined;
    assert.deepEqual(Geometry.parseGeoJSON(data.geoJSON), geometry);
}

function assertToWkt(data) {
    assert.equal(eval(data.geometry).toWkt(), data.wkt);
}

function assertToWkb(data) {
    assert.equal(eval(data.geometry).toWkb().toString('hex'), data.wkb);
}

function assertToEwkt(data) {
    var geometry = eval(data.geometry);
    geometry.srid = 4326;
    assert.equal(geometry.toEwkt(), 'SRID=4326;' + data.wkt);
}

function assertToEwkb(data) {
    var geometry = eval(data.geometry);
    geometry.srid = 4326;
    assert.equal(geometry.toEwkb().toString('hex'), data.ewkb);
}

function assertToTwkb(data) {
    assert.equal(eval(data.geometry).toTwkb().toString('hex'), data.twkb);
}

function assertToGeoJSON(data) {
    assert.deepEqual(eval(data.geometry).toGeoJSON(), data.geoJSON);
}

describe('wkx', function () {
    describe('Geometry', function () {
        it('parse(wkt) - coordinate', function () {
            assert.deepEqual(Geometry.parse('POINT(1 2)'), new Point(1, 2));
            assert.deepEqual(Geometry.parse('POINT(1.2 3.4)'), new Point(1.2, 3.4));
            assert.deepEqual(Geometry.parse('POINT(1 3.4)'), new Point(1, 3.4));
            assert.deepEqual(Geometry.parse('POINT(1.2 3)'), new Point(1.2, 3));

            assert.deepEqual(Geometry.parse('POINT(-1 -2)'), new Point(-1, -2));
            assert.deepEqual(Geometry.parse('POINT(-1 2)'), new Point(-1, 2));
            assert.deepEqual(Geometry.parse('POINT(1 -2)'), new Point(1, -2));

            assert.deepEqual(Geometry.parse('POINT(-1.2 -3.4)'), new Point(-1.2, -3.4));
            assert.deepEqual(Geometry.parse('POINT(-1.2 3.4)'), new Point(-1.2, 3.4));
            assert.deepEqual(Geometry.parse('POINT(1.2 -3.4)'), new Point(1.2, -3.4));

            assert.deepEqual(Geometry.parse('MULTIPOINT(1 2,3 4)'),
                                            new MultiPoint([new Point(1, 2), new Point(3, 4)]));
            assert.deepEqual(Geometry.parse('MULTIPOINT(1 2, 3 4)'),
                                            new MultiPoint([new Point(1, 2), new Point(3, 4)]));
            assert.deepEqual(Geometry.parse('MULTIPOINT((1 2),(3 4))'),
                                            new MultiPoint([new Point(1, 2), new Point(3, 4)]));
            assert.deepEqual(Geometry.parse('MULTIPOINT((1 2), (3 4))'),
                                            new MultiPoint([new Point(1, 2), new Point(3, 4)]));
        });
        it('parse() - invalid input', function () {
            assert.throws(Geometry.parse, /first argument must be a string or Buffer/);
            assert.throws(function () { Geometry.parse('TEST'); }, /Expected geometry type/);
            assert.throws(function () { Geometry.parse('POINT)'); }, /Expected group start/);
            assert.throws(function () { Geometry.parse('POINT(1 2'); }, /Expected group end/);
            assert.throws(function () { Geometry.parse('POINT(1)'); }, /Expected coordinates/);
            assert.throws(function () { Geometry.parse('TEST'); }, /Expected geometry type/);
            assert.throws(function () {
                Geometry.parse(new Buffer('010800000000000000', 'hex'));
            }, /GeometryType 8 not supported/);
            assert.throws(function () {
                Geometry.parseTwkb(new Buffer('a800c09a0c80b518', 'hex'));
            }, /GeometryType 8 not supported/);
            assert.throws(function () {
                Geometry.parseGeoJSON({ type: 'TEST' });
            }, /GeometryType TEST not supported/);
        });
    });

    function createTest (testKey, testData) {
        describe(testKey, function () {
            it ('parse(wkt)', function () {
                assertParseWkt(testData[testKey]);
            });
            it ('parse(wkb)', function () {
                assertParseWkb(testData[testKey]);
            });
            it ('parse(wkb xdr)', function () {
                assertParseWkbXdr(testData[testKey]);
            });
            it ('parse(ewkt)', function () {
                assertParseEwkt(testData[testKey]);
            });
            it ('parse(ewkb)', function () {
                assertParseEwkb(testData[testKey]);
            });
            it ('parse(ewkb xdr)', function () {
                assertParseEwkbXdr(testData[testKey]);
            });
            it ('parseTwkb()', function () {
                assertParseTwkb(testData[testKey]);
            });
            it ('parseGeoJSON()', function () {
                assertParseGeoJSON(testData[testKey]);
            });
            it ('toWkt()', function () {
                assertToWkt(testData[testKey]);
            });
            it ('toWkb()', function () {
                assertToWkb(testData[testKey]);
            });
            it ('toEwkt()', function () {
                assertToEwkt(testData[testKey]);
            });
            it ('toEwkb()', function () {
                assertToEwkb(testData[testKey]);
            });
            it ('toTwkb()', function () {
                assertToTwkb(testData[testKey]);
            });
            it ('toGeoJSON()', function () {
                assertToGeoJSON(testData[testKey]);
            });
        });
    }

    function createTests (testKey, testData) {
        describe(testKey, function () {
            for (var testDataKey in testData) {
                createTest(testDataKey, testData);
            }
        });
    }

    for (var testKey in tests) {
        createTests(testKey, tests[testKey]);
    }
});
