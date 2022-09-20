function createLogger (execlib, filterlib, outerlib) {
  'use strict';
  var mylib = {
    jobcores: require('./jobcores')(execlib)
  };

  require('./creator') (execlib, filterlib, outerlib, mylib);

  outerlib.Logger = mylib.Logger;
}
module.exports = createLogger;