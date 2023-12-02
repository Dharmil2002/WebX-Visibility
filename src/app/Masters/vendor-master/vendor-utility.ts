import { firstValueFrom } from "rxjs";
import Swal from "sweetalert2";
const companyCode = localStorage.getItem("companyCode");
/**
 * Handles the selection of a file and validates its format.
 *
 * @param {Object} data - The data containing event arguments.
 * @param {string} formControlName - The name of the form control.
 * @param {string[]} allowedFormats - An array of allowed file formats.
 */
export function handleFileSelection(data, formControlName, allowedFormats, vendorTableForm) {
    // Extract the FileList from the eventArgs
    let fileList: FileList = data.eventArgs;
    let SelectFile, imageName, selectedFiles
    if (fileList.length > 0) {
        const file: File = fileList[0];
        const fileFormat = file.type.split('/')[1]; // Extract file format from MIME type
        if (allowedFormats.includes(fileFormat)) {
            SelectFile = file;
            imageName = file.name;
            selectedFiles = true;

            // Set the value to the selected file
            vendorTableForm.controls[formControlName].setValue(file.name);
        } else {
            selectedFiles = false;

            // Show a warning if the selected format is not allowed
            Swal.fire({
                icon: "warning",
                title: "Alert",
                text: `Please select a valid file format: ${allowedFormats.join(', ')}`,
                showConfirmButton: true,
            });
        }
    } else {
        selectedFiles = false;

        // Show a warning if no file is selected
        Swal.fire({
            icon: "warning",
            title: "Alert",
            text: "Please select a file.",
            showConfirmButton: true,
        });
    }
}

export async function getVendorDetails(masterService, companyCode) {
    try {
        const req = {
            companyCode: companyCode,
            collectionName: "vendor_detail",
            filter: {}
        };

        // Make a request to the backend API using the masterService
        const res = await firstValueFrom(masterService.masterPost("generic/get", req));

        // Use type assertion to tell TypeScript that res is of type { data: SomeType } or undefined
        if (res && (res as any).data) {
            // Transform data into an array of objects with 'value' and 'name' properties
            const resDetail = (res as any).data.map(({ vendorCode, vendorName }) => ({ value: vendorCode, name: vendorName }));
            
            return resDetail;
        }
    } catch (error) {
        // Handle errors, log them, or show user-friendly messages
        console.error("Error fetching vendor details:", error);
        // Return an empty array or handle the error as needed
        return [];
    }
}
