var ZigZag = require('../lib/zigzag');

var assert = require('assert');

describe('wkx', function () {
    describe('ZigZag', function () {
        it('encode', function () {
            assert.equal(ZigZag.encode(-1), 1);
            assert.equal(ZigZag.encode(1), 2);
            assert.equal(ZigZag.encode(-2), 3);
            assert.equal(ZigZag.encode(2), 4);
        });
        it('decode', function () {
            assert.equal(ZigZag.decode(1), -1);
            assert.equal(ZigZag.decode(2), 1);
            assert.equal(ZigZag.decode(3), -2);
            assert.equal(ZigZag.decode(4), 2);
        });
    });
});
