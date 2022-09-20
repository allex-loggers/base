function createOnLoggerConfHandlerJobCore (execlib, mylib) {
  'use strict';

  var OnLoggerJobCore = mylib.OnLogger,
    lib = execlib.lib;

  function OnLoggerConfHandlerJobCore (logger, conf) {
    OnLoggerJobCore.call(this, logger);
    this.conf = conf;
  }
  lib.inherit(OnLoggerConfHandlerJobCore, OnLoggerJobCore);
  OnLoggerConfHandlerJobCore.prototype.shouldContinue = function () {
    var ret = OnLoggerJobCore.prototype.shouldContinue.call(this);
    if (ret) {
      return ret;
    }
    if (!this.conf && this.confIsCompulsory) {
      return new lib.Error('NO_CONFIGURATION', 'This instance of '+this.constructor.name+' must have a valid configuration');
    }
  };

  mylib.OnLoggerConfHandler = OnLoggerConfHandlerJobCore;
}
module.exports = createOnLoggerConfHandlerJobCore;