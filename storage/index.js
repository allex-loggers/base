function createStorage (execlib, outerlib) {
  'use strict';

  function Storage (desc) {
    this.desc = desc;
  }
  Storage.prototype.destroy = function () {
    this.desc = null;
  };
  Storage.prototype.create = function (thingy) {
    if (!this.desc) {
      console.log(thingy);
    }
  };

  outerlib.Storage = Storage;
}
module.exports = createStorage;