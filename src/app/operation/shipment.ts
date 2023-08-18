// shipment.ts

export interface Shipment {
    Shipment: number;
    Origin: string;
    Destination: string;
    Packages: number;
    Pending: number;
    routes: string;
    Leg: string;
    Action: string;
}

export interface LocationPair {
    origin: string;
    destination: string;
}

export type Location = string;

export const parseRoute = (routeStr: string): Location[] => {
    const locationsPart = routeStr.split(':')[1].trim();
    return locationsPart.split('-');
}


export const getOriginDestinationArrays = (routeStr: string, currentLocation: Location): { originArray: Location[], destinationArray: Location[] } => {
    const route = parseRoute(routeStr);
    const currentIndex = route.indexOf(currentLocation);
    if (currentIndex === -1) {
        throw new Error(`Invalid currentLocation: ${currentLocation}`);
    }
    const originArray = route.slice(0, currentIndex);
    const destinationArray = route.slice(currentIndex);  // +1 to exclude the current location from the destination array
    return { originArray, destinationArray };
}

export const filterShipments = (shipments: any[], routeStr: string, currentLocation: Location) => {
    const { originArray, destinationArray } = getOriginDestinationArrays(routeStr, currentLocation);
    return shipments.filter(shipment =>
        originArray.includes(shipment.orgLoc) && destinationArray.includes(shipment.destination.split(":")[1].trim())
    );
}

// Export the kpiData function to make it accessible in other modules
export function kpiData(csv, shipmentStatus, event) {
    // Initialize variables for counting packages and unloaded shipments
    let packages = 0;
    let shipingUnloaded = 0;
  
    // Iterate through the csv array to calculate total packages and unloaded shipments
    csv.forEach((element, index) => {
      packages = element.Packages + packages;
      shipingUnloaded = element.Unloaded + shipingUnloaded;
    });
  
    // Helper function to create a shipData object
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
    });
  
    // Create an array of shipData objects with dynamic values
    const shipData = [
      createShipDataObject(csv.length, "Shipments", "bg-c-Bottle-light"),
      createShipDataObject(packages, "Packages", "bg-c-Grape-light"),
      createShipDataObject(event?.shipment || 0, "Shipments" + ' ' + shipmentStatus, "bg-c-Daisy-light"),
      createShipDataObject(event?.Package || 0, "Packages" + ' ' + shipmentStatus, "bg-c-Grape-light"),
    ];
  
    // Return the shipData array
    return shipData;
  }
 export function autoBindData(formControls, formData) {
    // Iterate over each control in the form controls object
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        // Get the control instance
        const control = formControls[controlName];
        
        // Get the corresponding data value from the formData object,
        // or use an empty string if it doesn't exist
        const data = formData[controlName] || '';
  
        // Patch the value of the control with the data value
        control.patchValue(data);
  
        // Set the value of the control with the data value
        control.setValue(data);
      }
    }
  }
  
  export function getSealNumber(sealNo: number | undefined): number | string {
    return sealNo !== undefined ? sealNo : 'No seal number provided.';
  }
  
  