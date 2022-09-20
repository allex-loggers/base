function createFlattener (execlib, outerlib) {
  'use strict';

  var lib = execlib.lib,
    smartRead = require('./smartreadcreator')(lib);

  function Flattener(desc) {
    this.desc = desc;
  }
  Flattener.prototype.destroy = function () {
    this.desc = null;
  };

  Flattener.prototype.process = function (thingy) {
    return traverse.call(this, thingy);
  };

  //static, this is Flattener
  function traverse (thingy) {
    var trvobj = {
      in: thingy,
      out: {}
    },
    ret;
    lib.traverseShallow(this.desc, traverser.bind(null, trvobj));
    ret = trvobj.out;
    trvobj = null;
    return ret;
  };

  function traverser (obj, outstring, instring) {
    obj.out[outstring] = smartRead(obj.in, instring);
  }

  outerlib.Flattener = Flattener;
}
module.exports = createFlattener;