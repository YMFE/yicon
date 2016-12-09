'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = commandConvert;

var envUseUnixRegex = /\$(\w+)/g; // $my_var
var envUseWinRegex = /\%(.*?)\%/g; // %my_var%
var isWin = process.platform === 'win32';
var envExtract = isWin ? envUseUnixRegex : envUseWinRegex;

/**
 * Converts an environment variable usage to be appropriate for the current OS
 * @param {String} command Command to convert
 * @returns {String} Converted command
 */
function commandConvert(command) {
  var match = envExtract.exec(command);
  if (match) {
    command = isWin ? '%' + match[1] + '%' : '$' + match[1];
  }
  return command;
}
module.exports = exports['default'];