function createOnLoggerJobCore (execlib, mylib) {
  'use strict';

  var lib = execlib.lib;

  function OnLoggerJobCore(logger) {
    this.logger = logger;
  }
  OnLoggerJobCore.prototype.destroy = function () {
    this.logger = null;
  };
  OnLoggerJobCore.prototype.shouldContinue = function () {
    if (!this.logger) {
      return new lib.Error('ALREADY_DESTROYED', 'This instance of '+this.constructor.name+' is alredy destroyed');
    }
    if (!this.logger.jobs) {
      return new lib.Error('LOGGER_ALREADY_DESTROYED', 'Logger is already destroyed');
    }
  };

  mylib.OnLogger = OnLoggerJobCore;
}
module.exports = createOnLoggerJobCore;