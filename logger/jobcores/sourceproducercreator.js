function createSourceProducerJobCore (execlib, mylib) {
  var OnLoggerConfHandlerJobCore = mylib.OnLoggerConfHandler,
    lib = execlib.lib;

  function SourceProducerJobCore (logger, conf) {
    OnLoggerConfHandlerJobCore.call(this, logger, conf);
    this.ctor = null;
  }
  lib.inherit(SourceProducerJobCore, OnLoggerConfHandlerJobCore);
  SourceProducerJobCore.prototype.destroy = function () {
    this.ctor = null;
    OnLoggerConfHandlerJobCore.prototype.destroy.call(this);
  };
  SourceProducerJobCore.prototype.confIsCompulsory = true;
  SourceProducerJobCore.prototype.shouldContinue = function () {
    var ret = OnLoggerConfHandlerJobCore.prototype.shouldContinue.call(this);
    if (ret) {
      return ret;
    }
    if (!this.conf.modulename) {
      return new lib.Error('NO_MODULENAME_FOR_SOURCE', this.constructor.name+' must have a "modulename" in its conf');
    }
  };
  function samereturner (thingy) {
    return thingy;
  }
  SourceProducerJobCore.prototype.checkPreRequisites = function () {
    var prereqmodules = ['allex:logsourceregistry:lib']
    if (this.conf.prerequisites) {
      prereqmodules.push(this.conf.prerequisites);
    }
    return execlib.loadDependencies('client', prereqmodules, samereturner);
  };
  SourceProducerJobCore.prototype.loadModule = function () {
    return execlib.loadDependencies('client', [this.conf.modulename], samereturner);
  };
  SourceProducerJobCore.prototype.onModule = function (module) {
    this.ctor = (this.conf.ctorname) ? module[this.conf.ctorname] : module;
    if (!this.ctor) {
      throw new lib.Error('NO_CONSTRUCTOR', 'Modulename '+this.conf.modulename+' did not yield a logsource construtor');
    }
    return new this.ctor(this.conf.propertyhash);
  };
  SourceProducerJobCore.prototype.finalize = function (instance) {
    if (!instance) {
      throw new lib.Error('SOURCE_INSTANCE_NOT_PRODUCED', 'new-ing '+this.ctor.name+' did not yield an instance');
    }
    if (!(instance.destroyed instanceof lib.HookCollection)) {
      throw new lib.Error('SOURCE_INSTANCE_NOT_DESTROYABLE', this.ctor.name+' is not a Destroyable');
    }
    if (!(instance.logEvent instanceof lib.HookCollection)) {
      throw new lib.Error('SOURCE_INSTANCE_NOT_AN_EVENT_SOURCE', this.ctor.name+' does not have the logEvent event');
    }
    this.logger.source = instance;
    instance.destroyed.attachForSingleShot(this.logger.destroy.bind(this.logger));
    this.logger.logEventListener = instance.logEvent.attach(this.logger.onLogEvent.bind(this.logger));
    return true;
  };

  SourceProducerJobCore.prototype.steps = [
    'checkPreRequisites',
    'loadModule',
    'onModule',
    'finalize'
  ]

  mylib.SourceProducer = SourceProducerJobCore;
}
module.exports = createSourceProducerJobCore;