export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
 export function getShortName(stateName) {
    // Extract the first two letters of the state name
    const shortName = stateName.substring(0, 2).toUpperCase();

    return shortName;
}

export function generateString(initialString: string, sequentialIdentifier: string): string {
  return `${initialString}-${sequentialIdentifier}`;
}
