'use strict';

function fileSorter(fileA, fileB) {
  var result = 0;

  if((/(^|\/)(?:((?:u[0-9a-f]{4,6},?)+)\-)(.+)\.svg$/i).test(fileA)) {
    if((/(^|\/)(?:((?:u[0-9a-f]{4,6},?)+)\-)(.+)\.svg$/i).test(fileB)) {
      if(fileA < fileB) {
        result = -1;
      } else {
        result = 1;
      }
    } else {
      result = -1;
    }
  } else if((/(^|\/)(?:((?:u[0-9a-f]{4,6},?)+)\-)(.+)\.svg$/i).test(fileB)) {
    result = 1;
  } else if(fileA < fileB) {
    result = -1;
  } else {
    result = 1;
  }
  return result;
}

module.exports = fileSorter;
