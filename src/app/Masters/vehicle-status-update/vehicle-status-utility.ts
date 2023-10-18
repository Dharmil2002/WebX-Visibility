interface VehicleData {
    status: string;
    tripId: string;
}

/**
 * Fetches vehicle status data from the API.
 *
 * This function makes an asynchronous API call to retrieve vehicle status data from a service,
 * using the company code and type "operation". It sends a request to the API endpoint "common/getall"
 * with the specified request body containing the companyCode and collection name "vehicle_status".
 *
 * @returns {Promise<any>} A promise that resolves with the vehicleDetail data obtained from the API.
 *                        The structure of the data may vary based on the API response.
 *
 * @throws {any} If an error occurs during the API call, it will be caught and re-thrown to propagate it
 *              to the calling code. The error message will be logged to the console as well.
 */
export async function getVehicleStatusFromApi(companyCode, operationService) {
    const reqbody = {
        companyCode: companyCode,
        collectionName: "vehicle_status",
        filter: {}
    };

    try {
        const vehicleDetail = await operationService.operationMongoPost("generic/get", reqbody).toPromise();
        // Do something with the vehicleDetail data here
        return vehicleDetail.data; // Optionally, return the vehicleDetail data
    } catch (error) {
        // Handle any errors that might occur during the API call
        console.error("Error fetching vehicle details:", error);
        throw error; // Optionally, re-throw the error to propagate it to the calling code
    }
}

/**
 * Calculates vehicle data based on the provided parameters.
 * @param tableData - The table data.
 * @returns vehicle data object.
 */
export function getVehicleDashboardDetails(tableData: VehicleData[]) {
    const availableVehicles = tableData.filter(vehicle => vehicle.status === "Available");
    const totalTrips = tableData.filter(vehicle => vehicle.tripId !== "");

    const createShipDataObject = (count: number, title: string, className: string) => ({
        count,
        title,
        class: `info-box7 ${className} order-info-box7`,
    });

    return [
        createShipDataObject(totalTrips.length, "Total Trip", "bg-c-Bottle-light"),
        createShipDataObject(tableData.length, "Total Vehicle", "bg-c-Grape-light"),
        createShipDataObject(availableVehicles.length, "Available Vehicle", "bg-c-Daisy-light"),
    ];
}

export async function getLocationDetail(companyCode: number, _operationService) {
    const reqbody = {
        "companyCode": companyCode,
        "collectionName": "location_detail",
        "filter": {}
    };

    try {
        const locationData = await _operationService.operationMongoPost("generic/get", reqbody).toPromise();
        // Handle locationData or return it as needed
        const dropdownData = locationData.data.map(loc => { return { name: loc.locName, value: loc.locCode } })
        return dropdownData;
    } catch (error) {
        // Handle any errors that may occur during the API call
        console.error("Error fetching location data:", error);
        throw error; // Rethrow the error to handle it further up the call stack if needed
    }
}
export async function getvehicleDetail(companyCode: number, _operationService) {
    const reqbody = {
        "companyCode": companyCode,
        "collectionName": "vehicle_detail",
        "filter": {}
    };

    try {
        const vehicleData = await _operationService.operationMongoPost("generic/get", reqbody).toPromise();
        // Handle locationData or return it as needed
        // const dropdownData = vehicleData.data.map(loc => { return { name: loc.vehicleNo, value: loc.vehicleNo } })
        return vehicleData.data;
    } catch (error) {
        // Handle any errors that may occur during the API call
        console.error("Error fetching location data:", error);
        throw error; // Rethrow the error to handle it further up the call stack if needed
    }
}
export async function addVehicleStatusData(companyCode: number, _operationService, data) {
    const reqbody = {
        "companyCode": companyCode,
        "collectionName": "vehicle_status",
        "data": data
    };

    try {
        const response = await _operationService.operationMongoPost("generic/create", reqbody).toPromise();
        // Handle locationData or return it as needed
        return response;
    } catch (error) {
        // Handle any errors that may occur during the API call
        console.error("Error fetching vehicle data:", error);
        throw error; // Rethrow the error to handle it further up the call stack if needed
    }
}