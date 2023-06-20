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

export const filterShipments = (shipments: Shipment[], routeStr: string, currentLocation: Location): Shipment[] => {
    const { originArray, destinationArray } = getOriginDestinationArrays(routeStr, currentLocation);
    return shipments.filter(shipment =>
        originArray.includes(shipment.Origin) && destinationArray.includes(shipment.Destination) && shipment.routes === routeStr
    );
}
