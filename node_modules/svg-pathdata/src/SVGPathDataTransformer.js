'use strict';

// Transform SVG PathData
// http://www.w3.org/TR/SVG/paths.html#PathDataBNF

// a2c utility
var a2c = require('./a2c.js');

// Access to SVGPathData constructor
var SVGPathData = require('./SVGPathData.js');

// TransformStream inherance required modules
var TransformStream = require('readable-stream').Transform;
var util = require('util');

// Inherit of transform stream
util.inherits(SVGPathDataTransformer, TransformStream);

function SVGPathDataTransformer(transformFunction) {
  // Ensure new were used
  if(!(this instanceof SVGPathDataTransformer)) {
    return new (SVGPathDataTransformer.bind.apply(SVGPathDataTransformer,
      [SVGPathDataTransformer].concat([].slice.call(arguments, 0))));
  }

  // Transform function needed
  if('function' !== typeof transformFunction) {
    throw new Error('Please provide a transform callback to receive commands.');
  }
  this._transformer = transformFunction.apply(null, [].slice.call(arguments, 1));
  if('function' !== typeof this._transformer) {
    throw new Error('Please provide a valid transform (returning a function).');
  }

  // Parent constructor
  TransformStream.call(this, {
    objectMode: true,
  });
}

SVGPathDataTransformer.prototype._transform = function(commands, encoding, done) {
  var i;
  var j;

  if(!(commands instanceof Array)) {
    commands = [commands];
  }
  for(i = 0, j = commands.length; i < j; i++) {
    this.push(this._transformer(commands[i]));
  }
  done();
};

// Predefined transforming functions
// Rounds commands values
SVGPathDataTransformer.ROUND = function roundGenerator(roundVal) {
  roundVal = roundVal || 10e12;
  return function round(command) {
    // x1/y1 values
    if('undefined' !== typeof command.x1) {
      command.x1 = Math.round(command.x1 * roundVal) / roundVal;
    }
    if('undefined' !== typeof command.y1) {
      command.y1 = Math.round(command.y1 * roundVal) / roundVal;
    }
    // x2/y2 values
    if('undefined' !== typeof command.x2) {
      command.x2 = Math.round(command.x2 * roundVal) / roundVal;
    }
    if('undefined' !== typeof command.y2) {
      command.y2 = Math.round(command.y2 * roundVal) / roundVal;
    }
    // Finally x/y values
    if('undefined' !== typeof command.x) {
      command.x = Math.round(command.x * roundVal, 12) / roundVal;
    }
    if('undefined' !== typeof command.y) {
      command.y = Math.round(command.y * roundVal, 12) / roundVal;
    }
    return command;
  };
};

// Relative to absolute commands
SVGPathDataTransformer.TO_ABS = function toAbsGenerator() {
  var prevX = 0;
  var prevY = 0;
  var pathStartX = NaN;
  var pathStartY = NaN;

  return function toAbs(command) {
    if(isNaN(pathStartX) && (command.type & SVGPathData.DRAWING_COMMANDS)) {
      pathStartX = prevX;
      pathStartY = prevY;
    }
    if((command.type & SVGPathData.CLOSE_PATH) && !isNaN(pathStartX)) {
      prevX = isNaN(pathStartX) ? 0 : pathStartX;
      prevY = isNaN(pathStartY) ? 0 : pathStartY;
      pathStartX = NaN;
      pathStartY = NaN;
    }
    if(command.relative) {
      // x1/y1 values
      if('undefined' !== typeof command.x1) {
        command.x1 = prevX + command.x1;
      }
      if('undefined' !== typeof command.y1) {
        command.y1 = prevY + command.y1;
      }
      // x2/y2 values
      if('undefined' !== typeof command.x2) {
        command.x2 = prevX + command.x2;
      }
      if('undefined' !== typeof command.y2) {
        command.y2 = prevY + command.y2;
      }
      // Finally x/y values
      if('undefined' !== typeof command.x) {
        command.x = prevX + command.x;
      }
      if('undefined' !== typeof command.y) {
        command.y = prevY + command.y;
      }
      command.relative = false;
    }
    prevX = ('undefined' !== typeof command.x ? command.x : prevX);
    prevY = ('undefined' !== typeof command.y ? command.y : prevY);
    if(command.type & SVGPathData.MOVE_TO) {
      pathStartX = prevX;
      pathStartY = prevY;
    }
    return command;
  };
};

// Absolute to relative commands
SVGPathDataTransformer.TO_REL = function toRelGenerator() {
  var prevX = 0;
  var prevY = 0;

  return function toRel(command) {
    if(!command.relative) {
      // x1/y1 values
      if('undefined' !== typeof command.x1) {
        command.x1 -= prevX;
      }
      if('undefined' !== typeof command.y1) {
        command.y1 -= prevY;
      }
      // x2/y2 values
      if('undefined' !== typeof command.x2) {
        command.x2 -= prevX;
      }
      if('undefined' !== typeof command.y2) {
        command.y2 -= prevY;
      }
      // Finally x/y values
      if('undefined' !== typeof command.x) {
        command.x -= prevX;
      }
      if('undefined' !== typeof command.y) {
        command.y -= prevY;
      }
      command.relative = true;
    }
    prevX = ('undefined' !== typeof command.x ? prevX + command.x : prevX);
    prevY = ('undefined' !== typeof command.y ? prevY + command.y : prevY);
    return command;
  };
};

// SVG Transforms : http://www.w3.org/TR/SVGTiny12/coords.html#TransformList
// Matrix : http://apike.ca/prog_svg_transform.html
SVGPathDataTransformer.MATRIX = function matrixGenerator(a, b, c, d, e, f) {
  var prevX;
  var prevY;

  if('number' !== typeof a || 'number' !== typeof b ||
    'number' !== typeof c || 'number' !== typeof d ||
    'number' !== typeof e || 'number' !== typeof f) {
    throw new Error('A matrix transformation requires parameters' +
      ' [a,b,c,d,e,f] to be set and to be numbers.');
  }
  return function matrix(command) {
    var origX = command.x;
    var origX1 = command.x1;
    var origX2 = command.x2;

    if('undefined' !== typeof command.x) {
      command.x = (command.x * a) +
        ('undefined' !== typeof command.y ?
          command.y : (command.relative ? 0 : prevY || 0)
        ) * c +
        (command.relative && 'undefined' !== typeof prevX ? 0 : e);
    }
    if('undefined' !== typeof command.y) {
      command.y = ('undefined' !== typeof origX ?
          origX : (command.relative ? 0 : prevX || 0)
        ) * b +
        command.y * d +
        (command.relative && 'undefined' !== typeof prevY ? 0 : f);
    }
    if('undefined' !== typeof command.x1) {
      command.x1 = command.x1 * a + command.y1 * c +
        (command.relative && 'undefined' !== typeof prevX ? 0 : e);
    }
    if('undefined' !== typeof command.y1) {
      command.y1 = origX1 * b + command.y1 * d +
        (command.relative && 'undefined' !== typeof prevY ? 0 : f);
    }
    if('undefined' !== typeof command.x2) {
      command.x2 = command.x2 * a + command.y2 * c +
        (command.relative && 'undefined' !== typeof prevX ? 0 : e);
    }
    if('undefined' !== typeof command.y2) {
      command.y2 = origX2 * b + command.y2 * d +
        (command.relative && 'undefined' !== typeof prevY ? 0 : f);
    }
    function sq(x) { return x*x; }
    var det = a*d - b*c;
    if('undefined' !== typeof command.xRot) {
      // Skip if this is a pure translation
      if(a !== 1 || b !== 0 || c !== 0 || d !== 1) {
        // Special case for singular matrix
        if(det === 0) {
          // In the singular case, the arc is compressed to a line. The actual geometric image of the original
          // curve under this transform possibly extends beyond the starting and/or ending points of the segment, but
          // for simplicity we ignore this detail and just replace this command with a single line segment.
          delete command.rX;
          delete command.rY;
          delete command.xRot;
          delete command.lArcFlag;
          delete command.sweepFlag;
          command.type = SVGPathData.LINE_TO;
        } else {
          // Convert to radians
          var xRot = command.xRot*Math.PI/180;

          // Convert rotated ellipse to general conic form
          // x0^2/rX^2 + y0^2/rY^2 - 1 = 0
          // x0 = x*cos(xRot) + y*sin(xRot)
          // y0 = -x*sin(xRot) + y*cos(xRot)
          // --> A*x^2 + B*x*y + C*y^2 - 1 = 0, where
          var sinRot = Math.sin(xRot), cosRot = Math.cos(xRot),
              xCurve = 1/sq(command.rX), yCurve = 1/sq(command.rY);
          var A = sq(cosRot)*xCurve + sq(sinRot)*yCurve,
              B = 2*sinRot*cosRot*(xCurve - yCurve),
              C = sq(sinRot)*xCurve + sq(cosRot)*yCurve;

          // Apply matrix to A*x^2 + B*x*y + C*y^2 - 1 = 0
          // x1 = a*x + c*y
          // y1 = b*x + d*y
          //      (we can ignore e and f, since pure translations don't affect the shape of the ellipse)
          // --> A1*x1^2 + B1*x1*y1 + C1*y1^2 - det^2 = 0, where
          var A1 = A*d*d - B*b*d + C*b*b,
              B1 = B*(a*d + b*c) - 2*(A*c*d + C*a*b),
              C1 = A*c*c - B*a*c + C*a*a;

          // Unapply newXRot to get back to axis-aligned ellipse equation
          // x1 = x2*cos(newXRot) - y2*sin(newXRot)
          // y1 = x2*sin(newXRot) + y2*cos(newXRot)
          // A1*x1^2 + B1*x1*y1 + C1*y1^2 - det^2 =
          //   x2^2*(A1*cos(newXRot)^2 + B1*sin(newXRot)*cos(newXRot) + C1*sin(newXRot)^2)
          //   + x2*y2*(2*(C1 - A1)*sin(newXRot)*cos(newXRot) + B1*(cos(newXRot)^2 - sin(newXRot)^2))
          //   + y2^2*(A1*sin(newXRot)^2 - B1*sin(newXRot)*cos(newXRot) + C1*cos(newXRot)^2)
          //   (which must have the same zeroes as)
          // x2^2/newRX^2 + y2^2/newRY^2 - 1
          //   (so we have)
          // 2*(C1 - A1)*sin(newXRot)*cos(newXRot) + B1*(cos(newXRot)^2 - sin(newXRot)^2) = 0
          // (A1 - C1)*sin(2*newXRot) = B1*cos(2*newXRot)
          // 2*newXRot = atan2(B1, A1 - C1)
          var newXRot = ((Math.atan2(B1, A1 - C1) + Math.PI) % Math.PI)/2;
          // For any integer n, (atan2(B1, A1 - C1) + n*pi)/2 is a solution to the above; incrementing n just swaps the
          // x and y radii computed below (since that's what rotating an ellipse by pi/2 does).  Choosing the rotation
          // between 0 and pi/2 eliminates the ambiguity and leads to more predictable output.

          // Finally, we get newRX and newRY from the same-zeroes relationship that gave us newXRot
          var newSinRot = Math.sin(newXRot), newCosRot = Math.cos(newXRot);
          command.rX = Math.abs(det)/Math.sqrt(A1*sq(newCosRot) + B1*newSinRot*newCosRot + C1*sq(newSinRot));
          command.rY = Math.abs(det)/Math.sqrt(A1*sq(newSinRot) - B1*newSinRot*newCosRot + C1*sq(newCosRot));
          command.xRot = newXRot*180/Math.PI;
        }
      } 
    }
    // sweepFlag needs to be inverted when mirroring shapes
    // see http://www.itk.ilstu.edu/faculty/javila/SVG/SVG_drawing1/elliptical_curve.htm
    // m 65,10 a 50,25 0 1 0 50,25
    // M 65,60 A 50,25 0 1 1 115,35
    if('undefined' !== typeof command.sweepFlag) {
      command.sweepFlag = (command.sweepFlag + (0 <= det ? 0 : 1)) % 2;
    }

    prevX = ('undefined' !== typeof command.x ?
      (command.relative ? (prevX || 0) + command.x : command.x) :
      prevX || 0);
    prevY = ('undefined' !== typeof command.y ?
      (command.relative ? (prevY || 0) + command.y : command.y) :
      prevY || 0);
    return command;
  };
};

// Rotation
SVGPathDataTransformer.ROTATE = function rotateGenerator(a, x, y) {
  if('number' !== typeof a) {
    throw new Error('A rotate transformation requires the parameter a' +
      ' to be set and to be a number.');
  }
  return (function(toOrigin, doRotate, fromOrigin) {
    return function rotate(command) {
      return fromOrigin(doRotate(toOrigin(command)));
    };
  })(SVGPathDataTransformer.TRANSLATE(-(x || 0), -(y || 0)),
    SVGPathDataTransformer.MATRIX(Math.cos(a), Math.sin(a),
      -Math.sin(a), Math.cos(a), 0, 0),
    SVGPathDataTransformer.TRANSLATE(x || 0, y || 0)
  );
};

// Translation
SVGPathDataTransformer.TRANSLATE = function translateGenerator(dX, dY) {
  if('number' !== typeof dX) {
    throw new Error('A translate transformation requires the parameter dX' +
      ' to be set and to be a number.');
  }
  return SVGPathDataTransformer.MATRIX(1, 0, 0, 1, dX, dY || 0);
};

// Scaling
SVGPathDataTransformer.SCALE = function scaleGenerator(dX, dY) {
  if('number' !== typeof dX) {
    throw new Error('A scale transformation requires the parameter dX' +
      ' to be set and to be a number.');
  }
  return SVGPathDataTransformer.MATRIX(dX, 0, 0, dY || dX, 0, 0);
};

// Skew
SVGPathDataTransformer.SKEW_X = function skewXGenerator(a) {
  if('number' !== typeof a) {
    throw new Error('A skewX transformation requires the parameter x' +
      ' to be set and to be a number.');
  }
  return SVGPathDataTransformer.MATRIX(1, 0, Math.atan(a), 1, 0, 0);
};
SVGPathDataTransformer.SKEW_Y = function skewYGenerator(a) {
  if('number' !== typeof a) {
    throw new Error('A skewY transformation requires the parameter y' +
      ' to be set and to be a number.');
  }
  return SVGPathDataTransformer.MATRIX(1, Math.atan(a), 0, 1, 0, 0);
};

// Symetry througth the X axis
SVGPathDataTransformer.X_AXIS_SIMETRY = function xSymetryGenerator(xDecal) {
  return (function(toAbs, scale, translate) {
    return function xSymetry(command) {
      return translate(scale(toAbs(command)));
    };
  })(SVGPathDataTransformer.TO_ABS(),
    SVGPathDataTransformer.SCALE(-1, 1),
    SVGPathDataTransformer.TRANSLATE(xDecal || 0, 0)
  );
};

// Symetry througth the Y axis
SVGPathDataTransformer.Y_AXIS_SIMETRY = function ySymetryGenerator(yDecal) {
  return (function(toAbs, scale, translate) {
    return function ySymetry(command) {
      return translate(scale(toAbs(command)));
    };
  })(SVGPathDataTransformer.TO_ABS(),
    SVGPathDataTransformer.SCALE(1, -1),
    SVGPathDataTransformer.TRANSLATE(0, yDecal || 0)
  );
};

// Convert arc commands to curve commands
SVGPathDataTransformer.A_TO_C = function a2CGenerator() {
  var prevX = 0;
  var prevY = 0;
  var args;

  return (function(toAbs) {
    return function a2C(command) {
      var commands = [];
      var i;
      var ii;

      command = toAbs(command);
      if(command.type === SVGPathData.ARC) {
        args = a2c(prevX, prevY, command.rX, command.rX, command.xRot,
          command.lArcFlag, command.sweepFlag, command.x, command.y);
        prevX = command.x; prevY = command.y;
        for(i = 0, ii = args.length; i < ii; i += 6) {
          commands.push({
            type: SVGPathData.CURVE_TO,
            relative: false,
            x2: args[i],
            y2: args[i + 1],
            x1: args[i + 2],
            y1: args[i + 3],
            x: args[i + 4],
            y: args[i + 5],
          });
        }
        return commands;
      }
      prevX = command.x; prevY = command.y;
      return command;

    };
  })(SVGPathDataTransformer.TO_ABS());
};

module.exports = SVGPathDataTransformer;
