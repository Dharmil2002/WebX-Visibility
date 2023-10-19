// filter-utils.ts
export function filterAndUnique<T>(
  data: T[],
  filterFunction: (item: T) => boolean,
  mapFunction: (item: T) => { name: string, value: string }
): { name: string, value: string }[] {
  const seenItems = {};
  return data
    .filter(filterFunction)
    .filter((item: T) => {
      const key = item.toString().toLowerCase();
      const alreadySeen = seenItems[key];
      seenItems[key] = true;
      return !alreadySeen;
    })
    .map(mapFunction);
}
