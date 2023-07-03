/**
 * Removes duplicate objects from an array based on all key-value pairs.
 * @param {Array} objects - The array of objects.
 * @returns {Array} - The array with duplicate objects removed.
 */
export function removeDuplicateObjects(objects: Array<any>): Array<any> {
    const uniqueObjectsSet = new Set(objects.map(obj => JSON.stringify(obj) as string));
    return Array.from(uniqueObjectsSet).map(str => JSON.parse(str));
  }
  