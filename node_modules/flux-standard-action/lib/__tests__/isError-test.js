'use strict';

var _ = require('../');

var type = 'ACTION_TYPE';

describe('isError()', function () {
  it('returns true if action.error is strictly true', function () {
    expect(_.isError({ type: type, error: true })).to.be['true'];
    expect(_.isError({ type: type, error: 'true' })).to.be['false'];
    expect(_.isError({ type: type })).to.be['false'];
  });
});