import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
// Define a class for image handling
export class ImageHandling {
    companyCode: any = parseInt(localStorage.getItem("companyCode"));

    constructor(private masterService: MasterService,) { }

    //#region to handle file selection
    async uploadFile(event, controlName, formControl, imageData, masterName, documentGroup, jsonControl, allowedformates?: string[]) {
        // Get the selected files from the input element
        const files: FileList = event;
        if (files.length > 0) {
            const file: File = files[0];

            // Extract the file format from the MIME type
            const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type

            // Allowed file formats
            const allowedFormats = allowedformates;

            if (allowedFormats.includes(fileFormat)) {

                // Create a FormData object to prepare the file for upload
                const formData = new FormData();
                formData.append('companyCode', this.companyCode);
                formData.append('docType', masterName);
                formData.append('docGroup', documentGroup);
                formData.append('docNo', file.name);
                formData.append('file', file);

                try {
                    // Make the HTTP request to upload the file and await its response
                    const res = await this.masterService.masterPost("blob/upload", formData).toPromise();
                    const url = res.url;
                    // Store the file data and URL in the imageData object
                    imageData = {
                        ...imageData,
                        [controlName]: url
                    };
                    //setting isFileSelected to true
                    const control = jsonControl.find(x => x.name === controlName);
                    control.additionalData.isFileSelected = false
                    // Set the form control value to the file name
                    formControl.controls[controlName].setValue(file.name);
                } catch (error) {
                    // Handle HTTP request errors
                    console.error("HTTP request error:", error);
                }
            } else {
                // Show a warning if the selected format is not allowed
                Swal.fire({
                    icon: "warning",
                    title: "Alert",
                    text: `Please select a valid file format: ${allowedFormats.join(', ')}`,
                    showConfirmButton: true,
                });
                formControl.controls[controlName].setValue('');
                return false;
            }
        }

        // Return the updated imageData object
        return imageData;
    }

    //#endregion

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