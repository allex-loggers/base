function createLogger (execlib, filterlib, outerlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q,
    qlib = lib.qlib;

  function Logger (conf) {
    this.conf = this.makeUpConfiguration(conf||{});
    this.jobs = new qlib.JobCollection();
    this.source = null;
    this.filter = filterlib.createFromDescriptor(conf.filter);
    this.flattener = new this.Flattener(conf.flattener);
    this.storage = new this.Storage(conf.storage);
    this.logEventListener = null;
    runCompulsoryJob.call(this, new mylib.jobcores.SourceProducer(this, conf?conf.source:null));
  }
  Logger.prototype.destroy = function () {
    if (this.logEventListener) {
      this.logEventListener.destroy();
    }
    this.logEventListener = null;
    if (this.storage) {
      this.storage.destroy();
    }
    this.storage = null;
    if (this.flattener) {
      this.flattener.destroy();
    }
    this.flattener = null;
    if (this.filter) {
      this.filter.destroy();
    }
    this.filter = null;
    if (this.source) {
      this.source.destroy();
    }
    this.source = null;
    if (this.jobs) {
      this.jobs.destroy();
    }
    this.jobs = null;
    this.conf = null;
  };

  Logger.prototype.makeUpConfiguration = function (conf) {
    return conf;
  };

  Logger.prototype.onLogEvent = function (logevent) {
    var fltnd;
    if (!this.flattener) {
      return;
    }
    if (!this.storage) {
      return;
    }
    if (this.filter) {
      if (!this.filter.isOK(logevent)) {
        return;
      }
    }
    fltnd = this.flattener.process(logevent);
    if (!fltnd) {
      return;
    }
    this.storage.create(fltnd);
    /*
    this.jobs.run(
      '.',
      qlib.newSteppedJobOnSteppedInstance(
        new mylib.jobcores.EventProcessor(this, logevent)
      )
    );
    */
  };

  //static, this is Logger
  function runCompulsoryJob (jobcoreinstance) {
    this.jobs.run('.', qlib.newSteppedJobOnSteppedInstance(jobcoreinstance)).then(
      null,
      onCompulsoryJobFail.bind(this)
    )
  }
  function onCompulsoryJobFail(reason) {
    console.error(reason);
    console.error(this.constructor.name, 'with conf', this.conf, 'will destroy now');
    this.destroy();
  }

  Logger.prototype.Flattener = outerlib.Flattener;
  Logger.prototype.Storage = outerlib.Storage;

  Logger.prototype.imposeFilterDescriptor = function (conf, filterdesc) {
    conf.filter = filterlib.andDescriptors([conf ? conf.filter : null, filterdesc]);
  };

  mylib.Logger = Logger;
}
module.exports = createLogger;