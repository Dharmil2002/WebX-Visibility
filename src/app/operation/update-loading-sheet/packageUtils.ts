import Swal from 'sweetalert2';
let uniqueShipments: Set<number> = new Set(); 
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

  const unloadPackage = data.find((x: any) => x.bcSerialNo.trim() === scanValue);

  if (!unloadPackage) {
    showError("Not Allow to Unload Package", "This package does not belong to the current branch.");
    return;
  }
  if (unloadPackage.ScanFlag) {
    showError("Already Scanned", "Your Package ID is already scanned.");
    return;
  }

  const element = csv.find((e: any) => e.Shipment === unloadPackage.dockNo);

  if (!element || (element.hasOwnProperty('Unloaded') && element.Packages <= element.Unloaded)) {
    showError("Invalid Operation", "Cannot perform the operation. Packages must be greater than Unloaded.");
    return;
  }
  if (!uniqueShipments.has(element.Shipment)) {
    uniqueShipments.add(element.Shipment);
  }
  

  element.Pending--;
  element.Unloaded = (element.Unloaded || 0) + 1;
  unloadPackage.ScanFlag = true;
  
  //below the Process for The get All count of Unloaded Packages
  
  const totalUnloadedPackages = csv.reduce((total: number, e: any) => {
    return total + (e.Unloaded || 0);
  }, 0);

  //End

  const event = {
    shipment: uniqueShipments.size,
    Package: totalUnloadedPackages,
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

