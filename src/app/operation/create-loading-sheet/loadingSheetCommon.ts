type RouteLeg = string;

interface Legs {
  carryforwardLeg: RouteLeg[];
  forwardLeg: RouteLeg[];
}

export function transform(value: any, param: string): string {
  const parts = value.split(': ')[1].split('-');
  const index = parts.indexOf(param);

  if (index !== -1) {
    return parts.slice(index).join('-');
  }

  return '';

}
interface Shipment {
  Shipment: string,
  Origin: string,
  Destination: string,
  Packages: number,
  routes: string,
  Leg: string,
  Action?: string
}

type RouteStop = string;
type Route = RouteStop[];


function computeLegs(routeStr: string, current: string): Legs {
  // Extracting locations from route string
  const route = routeStr.split(': ')[1].split('-');
  
  const currentIndex = route.indexOf(current);
  
  if (currentIndex === -1) {
    throw new Error(`Current location ${current} not found in route`);
  }

  const carryforwardLeg: RouteLeg[] = [];
  for(let i = 0; i < currentIndex; i++) {
    for(let j = currentIndex+1; j < route.length; j++) {
      carryforwardLeg.push(`${route[i]}-${route[j]}`);
    }
  }

  const forwardLeg = route
    .slice(currentIndex + 1)
    .map(destination => `${current}-${destination}`);

  return { carryforwardLeg, forwardLeg };
}

let data: Shipment[] = [
  // Please copy your shipment data here
];

export function filterloadingShipments(data: any, routeStr: string, currentStop: string): Shipment[] {
  const { carryforwardLeg, forwardLeg } = computeLegs(routeStr, currentStop);
  console.log({ carryforwardLeg, forwardLeg });
  console.log("shipment:" + data)
  return data.filter(shipment => (carryforwardLeg.includes(shipment.Leg) && shipment.routes === routeStr) || forwardLeg.includes(shipment.Leg));
}

// usage: create-loading-sheet.component

/**
 * Filters shipment data based on location criteria.
 * @param shipmentData The shipment data to filter.
 * @param tripData The trip data used for filtering.
 * @param orgBranch The origin branch used for filtering.
 * @returns An array of filtered shipment data.
 */
export function filterDataByLocation(shipmentData: any, tripData: any, orgBranch: string): any {
  let filterData: any[] = [];
  let packagesData: any[] = [];
  let combinedData: any[] = [];

    filterData = shipmentData.shippingData.filter(
      (x) => x.routes.trim() === tripData.RouteandSchedule.trim() && x.Destination.trim() !== orgBranch.trim()
    );

    let routeData = transform(tripData.RouteandSchedule, orgBranch);
    let currentLeg = routeData.split("-").splice(1);

    // Filter shipment data based on origin and current leg destinations
    let legWiseData = shipmentData.shippingData.filter((x) => {
      return x.Origin.trim() === orgBranch && currentLeg.includes(x.Destination);
    });

    // Filter shipment data based on route and destination branch
    let routeWiseData = shipmentData.shippingData.filter((x) => {
      return x.routes.trim() === tripData.RouteandSchedule.trim() && x.Destination !== orgBranch;
    });

    // Merge the leg-wise and route-wise data
    let mergedData = legWiseData.concat(routeWiseData);
    let uniqueData = Array.from(new Set(mergedData));
    filterData = uniqueData;
  
    let data={
    filterData:filterData,
    legWiseData:legWiseData
  }
  return data;
}
export function groupShipments(combinedData) {
  const groupedData = {};

  // Group shipments by route
  combinedData.forEach(shipment => {
    const { Leg, Packages, KgWeight, CftVolume } = shipment;

    if (!groupedData[Leg]) {
      // If the route doesn't exist in groupedData, initialize it
      groupedData[Leg] = {
        Shipment: 0,        // Initialize shipment count to 0
        lag: Leg,           // Assign the leg route
        Packages: 0,        // Initialize packages count to 0
        WeightKg: 0,        // Initialize total weight in kg to 0
        VolumeCFT: 0,       // Initialize total volume in cubic feet to 0
      };
    }

    // Increment the count of shipments and update the packages, weight, and volume
    groupedData[Leg].Shipment++;
    groupedData[Leg].Packages += Packages;
    groupedData[Leg].WeightKg += KgWeight;
    groupedData[Leg].VolumeCFT += CftVolume;
  });

  // Convert the grouped data to an array
  let groupedShipments = Object.values(groupedData);

  return groupedShipments;
}


