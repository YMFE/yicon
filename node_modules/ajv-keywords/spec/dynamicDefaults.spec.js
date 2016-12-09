'use strict';

var Ajv = require('ajv');
var defFunc = require('../keywords/dynamicDefaults');
var defineKeywords = require('..');
var should = require('chai').should();
var assert = require('assert');
var uuid = require('uuid');


describe('keyword "dynamicDefaults"', function() {
  function getAjv() { return new Ajv({useDefaults: true, unknownFormats: true}); }

  var ajvs = [ getAjv(), getAjv(), getAjv() ];

  defFunc(ajvs[0]);
  defineKeywords(ajvs[1], 'dynamicDefaults');
  defineKeywords(ajvs[2]);

  ajvs.forEach(function (ajv, i) {
    it('should assign defaults #' + i, function (done) {
      var schema = {
        dynamicDefaults: {
          ts: 'timestamp',
          dt: 'datetime',
          d: 'date',
          t: 'time',
          r: 'random',
          ri: 'randomint',
          riN: { func: 'randomint', args: { max: 1000000 } },
          s: 'seq',
          sN: { func: 'seq', args: { name: 'foo' } }
        }
      };

      var validate = ajv.compile(schema);
      var data = {};
      validate(data) .should.equal(true);
      test(data);
      data.s .should.equal(2*i);
      data.sN .should.equal(2*i);

      setTimeout(function() {
        var data1 = {};
        validate(data1) .should.equal(true);
        test(data1);
        assert(data.ts < data1.ts);
        assert.notEqual(data.dt, data1.dt);
        assert.equal(data.d, data1.d);
        assert.notEqual(data.t, data1.t);
        assert.notEqual(data.r, data1.r);
        assert.notEqual(data.riN, data1.riN);

        data1.s .should.equal(2*i + 1);
        data1.sN .should.equal(2*i + 1);
        done();
      }, 1000);

      function test(data) {
        data.ts .should.be.a('number');
        assert(data.ts <= Date.now());

        ajv.validate({type: 'string', format: 'date-time'}, data.dt) .should.equal(true);
        new Date(data.dt) .should.be.a('Date');

        ajv.validate({type: 'string', format: 'date'}, data.d) .should.equal(true);
        (new Date).toISOString().indexOf(data.d) .should.equal(0);

        ajv.validate({type: 'string', format: 'time'}, data.t) .should.equal(true);

        data.r .should.be.a('number');
        assert(data.r < 1);
        assert(data.r >= 0);

        assert(data.ri === 0 || data.ri === 1);

        data.riN .should.be.a('number');
        assert.equal(Math.floor(data.riN), data.riN);
        assert(data.riN < 1000000);
        assert(data.riN >= 0);

        data.s .should.be.a('number');

        data.sN .should.be.a('number');
      }
    });

    it('should NOT assign default if property is present #' + i, function() {
      var schema = {
        dynamicDefaults: {
          ts: 'timestamp'
        }
      };

      var validate = ajv.compile(schema);
      var data = { ts: 123 };
      validate(data) .should.equal(true);
      data.ts .should.equal(123);
    });

    it('should NOT assign default inside anyOf etc. #' + i, function() {
      var schema = {
        anyOf: [
          {
            dynamicDefaults: {
              ts: 'timestamp'
            }
          }
        ]
      };

      var validate = ajv.compile(schema);
      var data = {};
      validate(data) .should.equal(true);
      should.not.exist(data.ts);
    });

    it('should fail schema compilation on unknown default #' + i, function() {
      var schema = {
        dynamicDefaults: {
          ts: 'unknown'
        }
      };

      should.throw(function() {
        ajv.compile(schema);
      });
    });

    it('should allow adding defaults #' + i, function() {
      var schema = {
        dynamicDefaults: {
          id: 'uuid'
        }
      };

      should.throw(function() {
        ajv.compile(schema);
      });

      defFunc.definition.DEFAULTS.uuid = uuidV4;

      var data = {};
      test(data);

      should.throw(function() {
        ajv.compile(schema);
      });

      defineKeywords.get('dynamicDefaults').definition.DEFAULTS.uuid = uuidV4;

      var data1 = {};
      test(data1);
      assert.notEqual(data.id, data1.id);

      function test(data) {
        ajv.validate(schema, data) .should.equal(true);
        ajv.validate({ format: 'uuid', type: 'string' }, data.id) .should.equal(true);

        delete defFunc.definition.DEFAULTS.uuid;
        ajv.removeSchema();
      }

      function uuidV4() { return uuid.v4(); }
    });
  });
});
