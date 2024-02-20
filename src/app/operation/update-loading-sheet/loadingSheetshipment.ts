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
// Assuming this function is inside a class called VehicleManager
export async function vehicleStatusUpdate(rptLoc, companyCode, arrivalData, operation,isClose) {

    try {
        if (!rptLoc || !companyCode || !arrivalData || !arrivalData.VehicleNo) {
            throw new Error("Missing required data for vehicle status update. Ensure all parameters are provided.");
        }
        let vehicleDetails = {
            rptLoc,
            status: isClose ? "Available" : "In Transit",
            ...(isClose
                ? {
                    tripId: "",
                    route: "",
                    currentLocation:localStorage.getItem("Branch"),
                    updateBy: localStorage.getItem("Username"),
                    updateDate: new Date().toISOString()
                  }
                : {})
        };
        
        const reqBody = {
            companyCode,
            collectionName: "vehicle_status",
            filter:{_id: arrivalData.VehicleNo},
            update: { ...vehicleDetails }
        };

        const vehicleUpdate = await operation.operationPut("generic/update", reqBody).toPromise();
        return vehicleUpdate; // Optionally, you can return the updated vehicle data.
    } catch (error) {
        throw error; // Re-throw the error to be handled at a higher level or log it.
    }
}
