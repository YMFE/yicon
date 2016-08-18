var BinaryWriter = require('../lib/binarywriter');

var assert = require('assert');

describe('wkx', function () {
    describe('BinaryWriter', function () {
        it('writeVarInt - 1', function () {
            var binaryWriter = new BinaryWriter(1);
            var length = binaryWriter.writeVarInt(1);

            assert.equal(binaryWriter.buffer.toString('hex'), '01');
            assert.equal(length, 1);
        });
        it('writeVarInt - 300', function () {
            var binaryWriter = new BinaryWriter(2);
            var length = binaryWriter.writeVarInt(300);

            assert.equal(binaryWriter.buffer.toString('hex'), 'ac02');
            assert.equal(length, 2);
        });
        it('writeUInt8 - enough space', function () {
            var binaryWriter = new BinaryWriter(1);
            binaryWriter.writeUInt8(1);
            assert.equal(binaryWriter.buffer.length, 1);
            assert.equal(binaryWriter.position, 1);
        });
        it('writeUInt16LE - not enough space', function () {
            var binaryWriter = new BinaryWriter(1);
            assert.throws(function () { binaryWriter.writeUInt16LE(1); }, /RangeError: index out of range/);
        });
        it('writeUInt8 - enough space / allow resize', function () {
            var binaryWriter = new BinaryWriter(1, true);
            binaryWriter.writeUInt8(1);
            assert.equal(binaryWriter.buffer.length, 1);
            assert.equal(binaryWriter.position, 1);
        });
        it('writeUInt16LE - not enough space  / allow resize', function () {
            var binaryWriter = new BinaryWriter(1, true);
            binaryWriter.writeUInt16LE(1);
            assert.equal(binaryWriter.buffer.length, 2);
            assert.equal(binaryWriter.position, 2);
        });
    });
});
