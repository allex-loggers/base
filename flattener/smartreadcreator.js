function createSmartRead (lib) {
  'use strict';

  function methodandprop (stringie) {
    var semicolonindex = stringie.indexOf(':'),
      method,
      prop;
    if (semicolonindex > 0) {
      return {
        prop: stringie.substring(0, semicolonindex),
        method: stringie.substring(semicolonindex+1)
      };
    }
    return {
      method: null,
      prop: stringie
    };
  }

  function readFromObj (obj, prop) {
    try {
      if ('object' != typeof obj && 'function' != typeof obj) {
        return;
      }
      return (prop in obj) 
      ?
      obj[prop]
      :
      lib.isFunction(obj.get) ? obj.get(prop) : obj[prop];
    }
    catch (e) {
      return;
    }
  }

  function readStep(obj, stringie) {
    var mnp = methodandprop(stringie);
    if (!lib.isVal(obj)) {
      return obj;
    }
    obj = readFromObj(obj, mnp.prop);
    try {
      switch(mnp.method) {
        case 'join':
          return lib.isArray(obj) ? obj.join(',') : obj;
        default:
          return obj;
      }
    }
    catch (e) {
      return null;
    }
  }

  function smartRead (obj, str) {
    var arry = str.split('.'),
      ret;
    ret = arry.reduce(readStep, obj);
    obj = null;
    return ret;
  }

  return smartRead
}
module.exports = createSmartRead;