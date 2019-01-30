/**
 * Created by USER on 05/01/2018.
 */
/**
 * @description Compares two objects. Replacing properties of the first object with the second.
 * @description If there is a key in the first object that doesnt
 * esit inthe second one, keep the key of the first oen
 * @param obj1
 * @param obj2
 * @returns {*}
 */
function getObjectDiff(obj1, obj2) {
  if (!obj1) return obj2;
  Object.keys(obj1).forEach((ob) => {
    if (obj2[ob]) {
      if (typeof obj2[ob] !== typeof obj1[ob]) throw new Error('Object types do not match');
      if (obj2[ob] && typeof obj2[ob] === 'object') {
        obj1[ob] = getObjectDiff(obj1[ob], obj2[ob]);
      } else {
        obj1[ob] = obj2[ob];
      }
    }
  });
  return obj1;
}
module.exports = getObjectDiff;
