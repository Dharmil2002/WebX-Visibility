/**
 * Removes duplicate objects from an array based on all key-value pairs.
 * @param {Array} objects - The array of objects.
 * @returns {Array} - The array with duplicate objects removed.
 */
export function removeDuplicateObjects(objects: Array<any>): Array<any> {
  const uniqueObjectsSet = new Set(objects.map(obj => JSON.stringify(obj) as string));
  return Array.from(uniqueObjectsSet).map(str => JSON.parse(str));
}

export function removeElementFromArray(arr: any[], key: string, value: any): any[] {
  return arr.filter(item => item[key] !== value);
}

export function getNextLocation(locationsArray: string[], currentLocation: string): string {
  let currentIndex = locationsArray.findIndex(loc => loc === currentLocation);

  if (currentIndex !== -1) {
    const nextIndex = (currentIndex + 1) % locationsArray.length;
    if (nextIndex === 0) {
      return ''; // Reached the last location, don't wrap around
    }
    const nextLocation = locationsArray[nextIndex];
    return nextLocation;
  } else {
    console.error("Current location not found!");
  }

}
// Function to format the date in "dd mm yy hh:mm" format
// Function to format the date in "dd mm yy hh:mm" format
export const formatDateTimeString = (date) => {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};