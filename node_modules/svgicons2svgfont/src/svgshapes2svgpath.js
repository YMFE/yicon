'use strict';

// http://www.whizkidtech.redprince.net/bezier/circle/
var KAPPA = ((Math.sqrt(2) - 1) / 3) * 4;

var svgShapesToPath = {
  rectToPath: svgShapesToPathRectToPath,
  polylineToPath: svgShapesToPathPolylineToPath,
  lineToPath: svgShapesToPathLineToPath,
  circleToPath: svgShapesToPathCircleToPath,
  polygonToPath: svgShapesToPathPolygonToPath,
};

module.exports = svgShapesToPath;

// Shapes helpers (should also move elsewhere)
function svgShapesToPathRectToPath(attributes) {
  var x = 'undefined' !== typeof attributes.x ?
    parseFloat(attributes.x, 10) :
    0;
  var y = 'undefined' !== typeof attributes.y ?
    parseFloat(attributes.y, 10) :
    0;
  var width = 'undefined' !== typeof attributes.width ?
    parseFloat(attributes.width, 10) :
    0;
  var height = 'undefined' !== typeof attributes.height ?
    parseFloat(attributes.height, 10) :
    0;
  var rx = 'undefined' !== typeof attributes.rx ?
    parseFloat(attributes.rx, 10) :
    0;
  var ry = 'undefined' !== typeof attributes.ry ?
    parseFloat(attributes.ry, 10) :
    0;

  return '' +
    // start at the left corner
    'M' + (x + rx) + ' ' + y +
    // top line
    'h' + (width - (rx * 2)) +
    // upper right corner
    (rx || ry ?
      'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry :
      ''
    ) +
    // Draw right side
    'v' + (height - (ry * 2)) +
    // Draw bottom right corner
    (rx || ry ?
      'a ' + rx + ' ' + ry + ' 0 0 1 ' + (rx * -1) + ' ' + ry :
      ''
    ) +
    // Down the down side
    'h' + ((width - (rx * 2)) * -1) +
    // Draw bottom right corner
    (rx || ry ?
      'a ' + rx + ' ' + ry + ' 0 0 1 ' + (rx * -1) + ' ' + (ry * -1) :
      ''
    ) +
    // Down the left side
    'v' + ((height - (ry * 2)) * -1) +
    // Draw bottom right corner
    (rx || ry ?
      'a ' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + (ry * -1) :
      ''
    ) +
    // Close path
    'z';
}

function svgShapesToPathPolylineToPath(attributes) {
  return 'M' + attributes.points;
}

function svgShapesToPathLineToPath(attributes) {
  // Move to the line start
  return '' +
  'M' + (parseFloat(attributes.x1, 10) || 0).toString(10) +
  ' ' + (parseFloat(attributes.y1, 10) || 0).toString(10) +
  ' ' + ((parseFloat(attributes.x1, 10) || 0) + 1).toString(10) +
  ' ' + ((parseFloat(attributes.y1, 10) || 0) + 1).toString(10) +
  ' ' + ((parseFloat(attributes.x2, 10) || 0) + 1).toString(10) +
  ' ' + ((parseFloat(attributes.y2, 10) || 0) + 1).toString(10) +
  ' ' + (parseFloat(attributes.x2, 10) || 0).toString(10) +
  ' ' + (parseFloat(attributes.y2, 10) || 0).toString(10) +
  'Z';
}

function svgShapesToPathCircleToPath(attributes) {
  var cx = parseFloat(attributes.cx, 10);
  var cy = parseFloat(attributes.cy, 10);
  var rx = 'undefined' !== typeof attributes.rx ?
    parseFloat(attributes.rx, 10) :
    parseFloat(attributes.r, 10);
  var ry = 'undefined' !== typeof attributes.ry ?
    parseFloat(attributes.ry, 10) :
    parseFloat(attributes.r, 10);

  return '' +
    'M' + (cx - rx) + ',' + cy +
    'C' + (cx - rx) + ',' + (cy + (ry * KAPPA)) +
    ' ' + (cx - (rx * KAPPA)) + ',' + (cy + ry) +
    ' ' + cx + ',' + (cy + ry) +
    'C' + (cx + (rx * KAPPA)) + ',' + (cy + ry) +
    ' ' + (cx + rx) + ',' + (cy + (ry * KAPPA)) +
    ' ' + (cx + rx) + ',' + cy +
    'C' + (cx + rx) + ',' + (cy - (ry * KAPPA)) +
    ' ' + (cx + (rx * KAPPA)) + ',' + (cy - ry) +
    ' ' + cx + ',' + (cy - ry) +
    'C' + (cx - (rx * KAPPA)) + ',' + (cy - ry) +
    ' ' + (cx - rx) + ',' + (cy - (ry * KAPPA)) +
    ' ' + (cx - rx) + ',' + cy +
    'Z';
}

function svgShapesToPathPolygonToPath(attributes) {
  return 'M' + attributes.points + 'Z';
}
