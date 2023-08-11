export class VehicleStatus {
    id: string;
    vehNo: string;
    status: string;
    tripId: string;
    currentLocation: string;
    route: string;

    constructor(vehicleStatus) {
        this.id = vehicleStatus?.id||"";
        this.vehNo = vehicleStatus?.vehNo||"";
        this.status = vehicleStatus?.status||"";
        this.tripId = vehicleStatus?.tripId||"";
        this.currentLocation = vehicleStatus?.currentLocation||"";
        this.route = vehicleStatus?.route||"";
    }
}