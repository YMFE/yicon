var assert = (
    global && global.chai
    ? global.chai.assert
    : require('chai').assert
  )
  , SVGPathData = (
    global && global.SVGPathData
    ? global.SVGPathData
    : require(__dirname + '/../src/SVGPathData.js')
  )
;

describe("Parsing eliptical arc commands", function() {

  beforeEach(function() {
  });

  afterEach(function() {
  });

  it("should not work when badly declarated", function() {
    assert.throw(function() {
      new SVGPathData('A');
    }, SyntaxError, 'Unterminated command at the path end.');
    assert.throw(function() {
      new SVGPathData('A 30');
    }, SyntaxError, 'Unterminated command at the path end.');
    assert.throw(function() {
      new SVGPathData('A 30 50');
    }, SyntaxError, 'Unterminated command at the path end.');
    assert.throw(function() {
      new SVGPathData('A 30 50 0');
    }, SyntaxError, 'Unterminated command at the path end.');
    assert.throw(function() {
      new SVGPathData('A 30 50 0 0');
    }, SyntaxError, 'Unterminated command at the path end.');
    assert.throw(function() {
      new SVGPathData('A 30 50 0 0 1');
    }, SyntaxError, 'Unterminated command at the path end.');
    assert.throw(function() {
      new SVGPathData('A 30 50 0 0 1 162.55');
    }, SyntaxError, 'Unterminated command at the path end.');
    assert.throw(function() {
      new SVGPathData('A 30 50 0 0 1 A 30 50 0 0 1 162.55 162.45');
    }, SyntaxError, 'Unterminated command at index 14.');
  });

  it("should not work with bad rX value", function() {
    assert.throw(function() {
      new SVGPathData('A,-30,50,0,0,1,162.55,162.45');
    }, SyntaxError, 'Expected positive number, got "-30" at index "5"');
  });

  it("should not work with bad rY value", function() {
    assert.throw(function() {
      new SVGPathData('A,30,-50,0,0,1,162.55,162.45');
    }, SyntaxError, 'Expected positive number, got "-50" at index "8"');
  });

  it("should not work with bad lArcFlag value", function() {
    assert.throw(function() {
      new SVGPathData('A,30,50,0,15,1,162.55,162.45');
    }, SyntaxError, 'Expected a flag, got "15" at index "12"');
  });

  it("should not work with bad sweepFlag value", function() {
    assert.throw(function() {
      new SVGPathData('A,30,50,0,0,15,162.55,162.45');
    }, SyntaxError, 'Expected a flag, got "15" at index "14"');
  });

  it("should work with comma separated coordinates", function() {
    var commands = new SVGPathData('A,30,50,0,0,1,162.55,162.45').commands;
    assert.equal(commands[0].type, SVGPathData.ARC);
    assert.equal(commands[0].relative, false);
    assert.equal(commands[0].rX, '30');
    assert.equal(commands[0].rY, '50');
    assert.equal(commands[0].xRot, '0');
    assert.equal(commands[0].lArcFlag, '0');
    assert.equal(commands[0].sweepFlag, '1');
    assert.equal(commands[0].x, '162.55');
    assert.equal(commands[0].y, '162.45');
  });

  it("should work with space separated coordinates", function() {
    var commands = new SVGPathData('A 30 50 0 0 1 162.55 162.45').commands;
    assert.equal(commands[0].type, SVGPathData.ARC);
    assert.equal(commands[0].relative, false);
    assert.equal(commands[0].rX, '30');
    assert.equal(commands[0].rY, '50');
    assert.equal(commands[0].xRot, '0');
    assert.equal(commands[0].lArcFlag, '0');
    assert.equal(commands[0].sweepFlag, '1');
    assert.equal(commands[0].x, '162.55');
    assert.equal(commands[0].y, '162.45');
  });

  it("should work with nested separated complexer coordinate pairs", function() {
    var commands = new SVGPathData('A 30,50 0 0 1 162.55,162.45').commands;
    assert.equal(commands[0].type, SVGPathData.ARC);
    assert.equal(commands[0].relative, false);
    assert.equal(commands[0].rX, '30');
    assert.equal(commands[0].rY, '50');
    assert.equal(commands[0].xRot, '0');
    assert.equal(commands[0].lArcFlag, '0');
    assert.equal(commands[0].sweepFlag, '1');
    assert.equal(commands[0].x, '162.55');
    assert.equal(commands[0].y, '162.45');
  });

  it("should work with multiple pairs of coordinates", function() {
    var commands = new SVGPathData(
      'A 10.0032e-5,20.0032e-5 0 0 1 -30.0032e-5,-40.0032e-5\
      50.0032e-5,60.0032e-5 0 1 0 -70.0032e-5,-80.0032e-5\
      90.0032e-5,90.0032e-5 0 0 1 -80.0032e-5,-70.0032e-5').commands;
    assert.equal(commands[0].type, SVGPathData.ARC);
    assert.equal(commands[0].relative, false);
    assert.equal(commands[0].rX, '10.0032e-5');
    assert.equal(commands[0].rY, '20.0032e-5');
    assert.equal(commands[0].xRot, '0');
    assert.equal(commands[0].lArcFlag, '0');
    assert.equal(commands[0].sweepFlag, '1');
    assert.equal(commands[0].x, '-30.0032e-5');
    assert.equal(commands[0].y, '-40.0032e-5');
    assert.equal(commands[1].type, SVGPathData.ARC);
    assert.equal(commands[1].relative, false);
    assert.equal(commands[1].rX, '50.0032e-5');
    assert.equal(commands[1].rY, '60.0032e-5');
    assert.equal(commands[1].xRot, '0');
    assert.equal(commands[1].lArcFlag, '1');
    assert.equal(commands[1].sweepFlag, '0');
    assert.equal(commands[1].x, '-70.0032e-5');
    assert.equal(commands[1].y, '-80.0032e-5');
    assert.equal(commands[2].type, SVGPathData.ARC);
    assert.equal(commands[2].relative, false);
    assert.equal(commands[2].rX, '90.0032e-5');
    assert.equal(commands[2].rY, '90.0032e-5');
    assert.equal(commands[2].xRot, '0');
    assert.equal(commands[2].lArcFlag, '0');
    assert.equal(commands[2].sweepFlag, '1');
    assert.equal(commands[2].x, '-80.0032e-5');
    assert.equal(commands[2].y, '-70.0032e-5');
  });

  it("should work with multiple declarated pairs of coordinates", function() {
    var commands = new SVGPathData(
      'A 10.0032e-5,20.0032e-5 0 0 1 -30.0032e-5,-40.0032e-5\
      a50.0032e-5,60.0032e-5 0 1 0 -70.0032e-5,-80.0032e-5\
      A90.0032e-5,90.0032e-5 0 0 1 -80.0032e-5,-70.0032e-5').commands;
    assert.equal(commands[0].type, SVGPathData.ARC);
    assert.equal(commands[0].relative, false);
    assert.equal(commands[0].rX, '10.0032e-5');
    assert.equal(commands[0].rY, '20.0032e-5');
    assert.equal(commands[0].xRot, '0');
    assert.equal(commands[0].lArcFlag, '0');
    assert.equal(commands[0].sweepFlag, '1');
    assert.equal(commands[0].x, '-30.0032e-5');
    assert.equal(commands[0].y, '-40.0032e-5');
    assert.equal(commands[1].type, SVGPathData.ARC);
    assert.equal(commands[1].relative, true);
    assert.equal(commands[1].rX, '50.0032e-5');
    assert.equal(commands[1].rY, '60.0032e-5');
    assert.equal(commands[1].xRot, '0');
    assert.equal(commands[1].lArcFlag, '1');
    assert.equal(commands[1].sweepFlag, '0');
    assert.equal(commands[1].x, '-70.0032e-5');
    assert.equal(commands[1].y, '-80.0032e-5');
    assert.equal(commands[2].type, SVGPathData.ARC);
    assert.equal(commands[2].relative, false);
    assert.equal(commands[2].rX, '90.0032e-5');
    assert.equal(commands[2].rY, '90.0032e-5');
    assert.equal(commands[2].xRot, '0');
    assert.equal(commands[2].lArcFlag, '0');
    assert.equal(commands[2].sweepFlag, '1');
    assert.equal(commands[2].x, '-80.0032e-5');
    assert.equal(commands[2].y, '-70.0032e-5');
  });

});

describe("Encoding eliptical arc commands", function() {

  it("should work with one command", function() {
      assert.equal(
        new SVGPathData('A30 50 0 0 1 162.55 162.45').encode(),
        'A30 50 0 0 1 162.55 162.45'
      );
  });

  it("should work with several commands", function() {
      assert.equal(
        new SVGPathData('A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45').encode(),
        'A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45A30 50 0 0 1 162.55 162.45'
      );
  });

});

describe("Transforming elliptical arc commands", function() {

  function assertDeepCloseTo(x, y, delta) {
    if(typeof x === 'number' && typeof y === 'number') {
      assert.closeTo(x, y, delta);
    } else if(typeof x === 'object' && typeof y === 'object') {
      var keys = Object.getOwnPropertyNames(x);
      assert.sameMembers(keys, Object.getOwnPropertyNames(y));
      for(var i = 0; i < keys.length; i++) {
        assertDeepCloseTo(x[keys[i]], y[keys[i]], delta);
      }
    } else if(typeof x === 'array' && typeof y === 'array') {
      assert.equal(x.length, y.length, 'arrays have different lengths');
      for(var i = 0; i < x.length; i++) {
        assertDeepCloseTo(x[i], y[i], delta);
      }
    } else {
      assert.equal(x, y);
    }
  }

  it("should rotate an axis-aligned arc", function() {
    assertDeepCloseTo(
      new SVGPathData('M 0,0 A 100,50 0 0 1 100,50z').rotate(Math.PI/6).commands,
      new SVGPathData('M 0,0 A 100,50 30 0 1 61.6,93.3z').commands,
      0.1
    );
  });

  it("should rotate an arbitrary arc", function() {
    assertDeepCloseTo(
      new SVGPathData('M 0,0 A 100,50 -15 0 1 100,0z').rotate(Math.PI/4).commands,
      new SVGPathData('M 0,0 A 100,50 30 0 1 70.7,70.7z').commands,
      0.1
    );
  });

  it("should skew", function() {
    assertDeepCloseTo(
      new SVGPathData('M 0,0 A 50,100 0 0 1 50,100z').skewX(Math.tan(-1)).commands,
      new SVGPathData('M 0,0 A 34.2,146.0 48.6 0 1 -50,100 Z').commands,
      0.1
    );
  });

  it("should tolerate singular matrices", function() {
    assertDeepCloseTo(
      new SVGPathData('M 0,0 A 80,80 0 0 1 50,100z').matrix(0.8,2,0.5,1.25,0,0).commands,
      new SVGPathData('M 0,0 L 90,225 Z').commands,
      0.1
    );
  });

  it("should match what Inkscape does on this random case", function() {
    assertDeepCloseTo(
      new SVGPathData('M 170.19275,911.55263 A 61.42857,154.28572 21.033507 0 1 57.481868,1033.5109 61.42857,154.28572 21.033507 0 1 55.521508,867.4575 61.42857,154.28572 21.033507 0 1 168.2324,745.4993 A 61.42857,154.28572 21.033507 0 1 170.19275,911.55263 z').matrix(-0.10825745,-0.37157241,0.77029181,0.3345653,-560.10375,633.84215).commands,
      new SVGPathData('M 123.63314,875.5771 A 135.65735,17.465974 30.334289 0 1 229.77839,958.26036 135.65735,17.465974 30.334289 0 1 102.08104,903.43307 135.65735,17.465974 30.334289 0 1 -4.0641555,820.74983 135.65735,17.465974 30.334289 0 1 123.63314,875.5771 z').commands,
      0.0001
    );
  });

  it("should reflect the sweep flag any time the determinant is negative", function() {
    assertDeepCloseTo(
      new SVGPathData('M 0,0 A 50,100 -30 1 1 80,80 Z').matrix(-1,0,0,1,0,0).commands,
      new SVGPathData('M 0,0 A 50,100 30 1 0 -80,80 Z').commands,
      0.1
    );
  });
});
