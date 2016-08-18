'use strict';

var _ = require('../');

var type = 'ACTION_TYPE';

describe('isFSA()', function () {
  it('requires a type', function () {
    expect(_.isFSA({ type: type })).to.be['true'];
  });

  it('only accepts plain objects', function () {
    var action = function action() {};
    action.type = type;
    expect(_.isFSA(action)).to.be['false'];
  });

  it('returns false if there are invalid keys', function () {
    expect(_.isFSA({ type: type, payload: 'foobar' })).to.be['true'];
    expect(_.isFSA({ type: type, meta: 'foobar' })).to.be['true'];
    expect(_.isFSA({ type: type, error: new Error() })).to.be['true'];
    expect(_.isFSA({ type: type, extra: 'foobar' })).to.be['false'];
  });
});