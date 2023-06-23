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

// usage:

