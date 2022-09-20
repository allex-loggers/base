function createEventProcessorJobCore (execlib, mylib) {
  'use strict';
  
  var OnLoggerJobCore = mylib.OnLogger,
    lib = execlib.lib;

  function EventProcessorJobCore (logger, evnt) {
    OnLoggerJobCore.call(this, logger);
    this.evnt = evnt;
  }
  lib.inherit(EventProcessorJobCore, OnLoggerJobCore);
  EventProcessorJobCore.prototype.destroy = function () {
    this.evnt = null;
    OnLoggerJobCore.prototype.destroy.call(this);
  };

  EventProcessorJobCore.prototype.filterAndFlatten = function () {
    if (!this.logger.flattener) {
      return;
    }
    if (!this.logger.storage) {
      return;
    }
    if (this.logger.filter) {
      if (!this.logger.filter.isOK(this.evnt)) {
        return;
      }
    }
    return this.logger.flattener.process(this.evnt);
  };
  EventProcessorJobCore.prototype.onFilteredAndFlattened = function (flt) {
    if (!lib.isVal(flt)) {
      return;
    }
    return this.logger.storage.create(flt);
  };

  EventProcessorJobCore.prototype.steps = [
    'filterAndFlatten',
    'onFilteredAndFlattened'
  ];

  mylib.EventProcessor = EventProcessorJobCore;
}
module.exports = createEventProcessorJobCore;