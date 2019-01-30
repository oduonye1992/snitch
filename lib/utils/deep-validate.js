/**
 * Created by USER on 05/01/2018.
 */
function deepValidate(obj1, obj2, parent = []) {
  Object.keys(obj1).forEach((ob) => {
    if (obj2[ob] !== undefined) {
      if (typeof obj2[ob] !== typeof obj1[ob]) { throw new Error(`${parent.toString().replace('.', '.')}.${obj2[ob]} must be of type ${typeof obj1[ob]}`); }
      if (obj1[ob] && typeof obj1[ob] === 'object') {
        parent.push(ob);
        deepValidate(obj1[ob], obj2[ob], parent);
      }
    } else {
      throw new Error(`${parent.toString().replace(',', '.')}.${ob} is required`);
    }
  });
  return true;
}
module.exports = deepValidate;
