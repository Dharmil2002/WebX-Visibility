export interface Shipment {
    Shipment: number;
    Origin: string;
    Destination: string;
    Packages: number;
    routes: string;
    Leg: string;
    Pending?: number;  // This is optional
    Action: string;
}

export function updatePending(shipments: Shipment[], location: string, loading: boolean, unloading: boolean): Shipment[] {
    return shipments.map(shipment => {
        if ((unloading && shipment.Destination === location) || (loading && shipment.Origin === location)) {
            shipment.Pending = shipment.Packages;
        }
        return shipment;
    });
}
