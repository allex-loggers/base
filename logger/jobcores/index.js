function createLoggerJobCores (execlib) {
  'use strict';
  var mylib = {};

  require('./onloggercreator')(execlib, mylib);
  require('./onloggerconfhandlerproducer')(execlib, mylib);
  require('./sourceproducercreator')(execlib, mylib);
  require('./eventprocessorcreator')(execlib, mylib);

  return mylib;
}
module.exports = createLoggerJobCores;