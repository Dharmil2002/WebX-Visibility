// Define a class for image handling
export class ImageHandling {
    constructor() { }

    // #region to define a method to extract the filename from a URL
    extractFileName(url: string): string {
        // Split the URL by '/' to separate its parts
        const parts = url.split('/');

        // Get the last part of the URL, which contains the filename with a timestamp
        const filenameWithTimestamp = parts[parts.length - 1];

        // Split the filename by '_' to separate it from the timestamp
        const filenameParts = filenameWithTimestamp.split('_');

        // The actual filename is the first part before the timestamp
        const fileName = filenameParts[0];

        // Return the extracted filename
        return fileName;
    }
    //#endregion

    // #region to get a file by key from a data object
    getFileByKey(key: string, dataObject: Record<string, any> = {}): any {
        // Check if the key exists in the data object
        if (dataObject.hasOwnProperty(key)) {
            // Return the value associated with the key
            return dataObject[key];
        } else {
            // Key not found in the data object, return null
            return null;
        }
    }
    //#endregion
}