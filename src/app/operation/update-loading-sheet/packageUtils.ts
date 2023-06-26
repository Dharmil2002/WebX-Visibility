import Swal from 'sweetalert2';

/**
 * Function to handle package updates
 * @param scanValue - The scan value of the package
 * @param legValue - The leg value of the package
 * @param currentBranch - The current branch value
 * @param data - The data containing packages
 * @param csv - The CSV data
 * @param boxData - The box data
 * @param cdr - The change detector reference
 * @returns The event object
 */

export function handlePackageUpdate(scanValue: string, legValue: string, currentBranch: string, data: any, csv: any[], boxData: any, cdr: any) {
  const unloadPackage = data.packagesData.find((x: any) => x.PackageId.trim() === scanValue && x.Routes.trim() === legValue);

  if (!unloadPackage) {
    showError("Not Allow to Unload Package", "This package does not belong to the current branch.");
    return;
  }

  if (unloadPackage.Destination.trim() !== currentBranch) {
    showError("Not Allowed", "This package does not belong to the current branch.");
    return;
  }

  if (unloadPackage.ScanFlag) {
    showError("Already Scanned", "Your Package ID is already scanned.");
    return;
  }

  const element = csv.find((e: any) => e.Shipment === unloadPackage.Shipment);

  if (!element || (element.hasOwnProperty('Unloaded') && element.Packages <= element.Unloaded)) {
    showError("Invalid Operation", "Cannot perform the operation. Packages must be greater than Unloaded.");
    return;
  }

  element.Pending--;
  element.Unloaded = (element.Unloaded || 0) + 1;
  unloadPackage.ScanFlag = true;

  const event = {
    shipment: csv.length,
    Package: element.Unloaded,
  };

  // Call kpiData function
  cdr.detectChanges();

  return event;
}

/**
 * Function to show error messages
 * @param title - The title of the error message
 * @param text - The text of the error message
 */
function showError(title: string, text: string) {
  Swal.fire({
    icon: "error",
    title,
    text,
    showConfirmButton: true,
  });
}

