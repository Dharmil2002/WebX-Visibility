import Swal from "sweetalert2";
let uniqueShipments: Set<number> = new Set();
/**
 * Performs the vehicle loading scan operation.
 * @param loadPackage - The package to be loaded.
 * @param currentBranch - The current branch location.
 * @param csv - The CSV data array.
 * @returns The event object containing shipment and package information.
 */
export function vehicleLoadingScan(loadPackage: any,csv: any[]): any {
  // Check if the unload package exists
  if (!loadPackage) {
    // Package does not belong to the current branch
    Swal.fire({
      icon: "error",
      title: "Not Allowed to Load Package",
      text: "This package does not belong to the current branch.",
      showConfirmButton: true,
    });
    return;
  }

  // // If destination does not belong to the current location, disallow unloading the package
  // if (loadPackage.Destination.trim() == currentBranch) {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Not Allowed to Load Package",
  //     text: "This package does not belong to the current branch.",
  //     showConfirmButton: true,
  //   });
  //   return;
  // }

  // Check if the package is already scanned
  if (loadPackage.ScanFlag) {
    Swal.fire({
      icon: "info",
      title: "Already Scanned",
      text: "Your Package ID is already scanned.",
      showConfirmButton: true,
    });
    return;
  }

  // Find the element in the csv array that matches the shipment
  const element = csv.find(e => e.Shipment === loadPackage.dockNo);

  // Check if the element exists and the number of Loaded packages is less than the total packages
  if (!element || (element.hasOwnProperty('loaded') && element.Packages <= element.loaded)) {
    // Invalid operation, packages must be greater than Loaded
    Swal.fire({
      icon: "error",
      title: "Invalid Operation",
      text: "Cannot perform the operation. Packages must be greater than loaded.",
      showConfirmButton: true,
    });
    return;
  }


  // Update Pending and Loaded counts
  element.Pending--;
  element.loaded = (element.loaded || 0) + 1;
  loadPackage.ScanFlag = true;
  // Prepare kpiData
  //below the Process for The get All count of Loaded Packages
  const totalLoadedPackages = csv.reduce((total: number, e: any) => {
    return total + (e.loaded || 0);
  }, 0);
  //End
  if (!uniqueShipments.has(element.Shipment)) {
    uniqueShipments.add(element.Shipment);
  }
  const event = {
    shipment: uniqueShipments.size,
    Package: totalLoadedPackages,
  };


  return event;
}
