import Swal from "sweetalert2";
export interface Shipment {
    documentId: string;
    type: string;
    customer: string;
    address: number;
    pincode: string;
    packages: string;
    weight: number;  
    pending:string;
    cluster:string;// This is optional
    Action: string;
}

let uniqueShipments: Set<number> = new Set();
export function updateRunsheetPending(shipments: Shipment[], cluster: string): Shipment[] {
    return shipments.map(shipment => {
        if (shipment.cluster === cluster) {
            shipment.pending = shipment.packages;
        }
        return shipment;
    });
}
export function groupShipingRunsheetTableData(shipingTableData) {
    const groupedData = {};
  
    shipingTableData.forEach(element => {
      let cluster = element.cluster.trim();
  
      // Check if the leg already exists in the groupedData object
      if (!groupedData.hasOwnProperty(cluster)) {
        groupedData[cluster] = {
          Shipment: 0,
          Packages: 0,
          WeightKg: 0,
          VolumeCFT: 0
        };
      }
  
      // Increment the shipment count
      groupedData[cluster].Shipment += 1;
  
  
      // Calculate Packages, WeightKg, and VolumeCFT for the current leg
      groupedData[cluster].Packages += element.Packages;
      groupedData[cluster].WeightKg += element.KgWt;
      groupedData[cluster].VolumeCFT += element.CftVolume;
    });
  
    // Convert the groupedData object to an array of values
    let shipingTableDataArray = Object.values(groupedData);
  
    return shipingTableDataArray;
  }

/**
 * Performs the vehicle loading scan operation.
 * @param loadPackage - The package to be loaded.
 * @param cluster - The cluster branch location.
 * @param csv - The CSV data array.
 * @returns The event object containing shipment and package information.
 */
export function runSheetLoadingScan(loadPackage: any, csv: any[]): any {

  // Check if the unload package exists
  if (!loadPackage) {
    Swal.fire({
      icon: "error",
      title: "Not Allowed to Load Package",
      text: "This package does not belong to the current cluster.",
      showConfirmButton: true,
    });
    return;
  }


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
  const element = csv.find(e => e.shipment === loadPackage.documentId);

  // Check if the element exists and the number of Loaded packages is less than the total packages
  if (!element || (element.hasOwnProperty('loaded') && element.packages <= element.loaded)) {
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
  element.pending--;
  element.loaded = (element.loaded || 0) + 1;
  loadPackage.ScanFlag = true;
  // Prepare kpiData
  //below the Process for The get All count of Loaded Packages
  const totalLoadedPackages = csv.reduce((total: number, e: any) => {
    return total + (e.loaded || 0);
  }, 0);
  //End
  if (!uniqueShipments.has(element.shipment)) {
    uniqueShipments.add(element.shipment);
  }
  const event = {
    shipment: uniqueShipments.size,
    Package: totalLoadedPackages,
  };


  return event;
}
