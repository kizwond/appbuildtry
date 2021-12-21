export function getAllChildrenKeys(obj, key, value) {
  function findNested(obj, key, value) {
    // Base case
    if (obj[key] === value) {
      return obj;
    } else {
      let keys = Object.keys(obj); // add this line to iterate over the keys

      for (let i = 0, len = keys.length; i < len; i++) {
        let k = keys[i]; // use this key for iteration, instead of index "i"

        // add "obj[k] &&" to ignore null values
        if (obj[k] && typeof obj[k] == "object") {
          let found = findNested(obj[k], key, value);
          if (found) {
            // If the object was found in the recursive call, bubble it up.
            return found;
          }
        }
      }
    }
  }

  function findProp(obj, key, out) {
    let i,
      proto = Object.prototype,
      ts = proto.toString,
      hasOwn = proto.hasOwnProperty.bind(obj);

    if ("[object Array]" !== ts.call(out)) out = [];

    for (i in obj) {
      if (hasOwn(i)) {
        if (i === key) {
          out.push(obj[i]);
        } else if (
          "[object Array]" === ts.call(obj[i]) ||
          "[object Object]" === ts.call(obj[i])
        ) {
          findProp(obj[i], key, out);
        }
      }
    }

    return out;
  }

  return findProp(findNested(obj, key, value), key, []);
}
