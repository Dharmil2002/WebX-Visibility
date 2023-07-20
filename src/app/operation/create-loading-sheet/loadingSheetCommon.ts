type RouteLeg = string;

interface Legs {
  carryforwardLeg: RouteLeg[];
  forwardLeg: RouteLeg[];
}

export function transform(value: any, param: string): string {
  const parts = value.split(':')[1].split('-');
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
  return data.filter(shipment => (carryforwardLeg.includes(shipment.Leg) && shipment.routes === routeStr) || forwardLeg.includes(shipment.Leg));
}

// usage: -screate-loadingheet.component

/**
 * Filters shipment data based on location criteria.
 * @param shipmentData The shipment data to filter.
 * @param tripData The trip data used for filtering.
 * @param orgBranch The origin branch used for filtering.
 * @returns An array of filtered shipment data.
 */
export function filterDataByLocation(shipmentData: any, tripData: any, orgBranch: string): any {
  let filterData: any[] = [];

  filterData = shipmentData.filter(
    (x) => x.orgLoc.trim() === orgBranch.trim() && (!x.destination || x.destination.trim() === '' || x.destination.split(':')[1].trim() !== orgBranch.trim())
  );

  let routeData = transform(tripData.RouteandSchedule, orgBranch);
  let currentLeg = routeData.split("-").splice(1);

  // Filter shipment data based on origin and current leg destinations
  let legWiseData = shipmentData.filter((x) => {
    return x.orgLoc.trim() === orgBranch.trim() && currentLeg.includes(x.destination?.split(':')[1]?.trim());
  });

  // Filter shipment data based on route and destination branch
  let routeWiseData = shipmentData.filter((x) => {
    return x.orgLoc.trim() === orgBranch.trim() && (!x.destination || x.destination.trim() === '' || x.destination.split(':')[1].trim() !== orgBranch);
  });

  // Merge the leg-wise and route-wise data
  let mergedData = legWiseData.concat(routeWiseData);
  let uniqueData = Array.from(new Set(mergedData));
  filterData = uniqueData;

  let data = {
    filterData: filterData,
    legWiseData: legWiseData
  };
  return data;
}


export function groupShipments(combinedData) {
  const groupedData = combinedData.reduce((result, item) => {
    const leg = item.orgLoc + "-" + item.destination.split(':')[1];
  
    const legData = {
      leg,
      count: 0,
      packages: 0,
      volumeCFT: 0,
      weightKg: 0
    };
  
    if (!result[leg]) {
      result[leg] = legData;
    }
  
    result[leg].count++;
    result[leg].packages += parseInt(item.totalChargedNoOfpkg);
    result[leg].weightKg += parseInt(item.chrgwt);
    result[leg].volumeCFT += parseFloat(item.cft_tot);
  
    return result;
  }, {});
  
  return Object.values(groupedData);
}


