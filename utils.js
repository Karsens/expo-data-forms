export const notNullNorUndefined = thing =>
  thing !== null && thing !== undefined;

export const mergeObjectArray = (objectArray: Object[]) =>
  objectArray.reduce((all, current) => ({ ...all, ...current }), {});

export const removeDuplicates = array => {
  const prims = { boolean: {}, number: {}, string: {} },
    objs = [];

  return array.filter(item => {
    var type = typeof item;
    if (type in prims) {
      return prims[type].hasOwnProperty(item)
        ? false
        : (prims[type][item] = true);
    } else {
      return objs.indexOf(item) >= 0 ? false : objs.push(item);
    }
  });
};
