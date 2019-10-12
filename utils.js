export const notNullNorUndefined = thing =>
  thing !== null && thing !== undefined;

export const mergeObjectArray = (objectArray: Object[]) =>
  objectArray.reduce((all, current) => ({ ...all, ...current }), {});
