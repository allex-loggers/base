function createLib (execlib, filterlib) {
  'use strict';
  var mylib = {};
  require('./flattener')(execlib, mylib);
  require('./storage')(execlib, mylib);
  require('./logger')(execlib, filterlib, mylib);

  return mylib.Logger;
}
module.exports = createLib;