import { format, isValid, parseISO } from "date-fns";

/**
 * Extracts unique values from a specified property in an array of objects.
 *
 * @param data - The array of objects.
 * @param property - The property to extract unique values from.
 * @returns An array of unique values from the specified property.
 */
export function extractUniqueValues<T>(data: T[], property: keyof T): any[] {
    const uniqueValues: any[] = [];
    const uniqueSet = new Set();
    // Loop through each entry in the data array
    data.forEach(entry => {
      const value = entry[property];
      // Check if the value is not already in the unique set
      if (!uniqueSet.has(value)) {
        // Add the value to the unique set and unique values array
        uniqueSet.add(value);
        uniqueValues.push(entry);
      }
    });
  
    // Return the array of unique values
    return uniqueValues;
  }
  ///date formater
 export function formatDocketDate(dateString) {
    if (dateString) {
        const parsedDate = parseISO(dateString);
        if (isValid(parsedDate)) {
            return format(parsedDate, "dd-MM-yy HH:mm");
        }
    }
    return null;
}

function formatDate(dateString: string | null): string {
  if (!dateString) {
    return '';
  }

  try {
    const parsedDate = new Date(dateString);

    if (!isNaN(parsedDate.getTime())) {
      // Use the desired format here
      return parsedDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    } else {
      // Handle the case where the date string is not valid
      return 'Invalid Date';
    }
  } catch (error) {
    // Handle any parsing errors
    console.error('Error parsing date:', error);
    return 'Error';
  }
}

// Example usage: