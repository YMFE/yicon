var Geometry = require('../lib/geometry');
var Point = require('../lib/point');

var assert = require('assert');

describe('wkx', function () {
    describe('parseTwkb', function () {
        it('includes size', function () {            
            assert.deepEqual(Geometry.parseTwkb(
                             new Buffer('0102020204', 'hex')),
                             new Point(1, 2));
        });
        it('includes bounding box', function () {
            assert.deepEqual(Geometry.parseTwkb(
                             new Buffer('0101020004000204', 'hex')),
                             new Point(1, 2));
        });
        it('includes extended precision', function () {
            assert.deepEqual(Geometry.parseTwkb(
                             new Buffer('01080302040608', 'hex')),
                             new Point(1, 2, 3, 4));
        });
        it('includes extended precision and bounding box', function () {
            assert.deepEqual(Geometry.parseTwkb(
                             new Buffer('010903020004000600080002040608', 'hex')),
                             new Point(1, 2, 3, 4));
        });
    });
    describe('toTwkb', function () {
        it('Point small', function () {
            assert.equal(new Point(1, 2).toTwkb().toString('hex'), 'a100c09a0c80b518');
        });
        it('Point large', function () {
            assert.equal(new Point(10000, 20000).toTwkb().toString('hex'), 'a10080a8d6b90780d0acf30e');
        });
    });
});
