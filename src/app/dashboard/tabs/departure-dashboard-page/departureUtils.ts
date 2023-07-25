import { addHours } from "date-fns";

/**
 * Fetches departure details from the API based on the provided parameters.
 * @param companyCode - The company code.
 * @param orgBranch - The organization branch.
 * @param operationService - The operation service for making API requests.
 * @returns A promise that resolves to the table data of departure details.
 */
export async function fetchDepartureDetails(
  companyCode: number,
  orgBranch: string,
  operationService: any
): Promise<any[]> {

  // Prepare request payload
  let req = {
    companyCode: companyCode,
    type: "operation",
    collection: "trip_detail",
  };
  let routeReq = {
    companyCode: companyCode,
    type: "masters",
    collection: "route",
  };

  try {
    // Send request and await response for  trip Detai;s
    const res: any = await operationService
      .operationPost("common/getall", req)
      .toPromise();
    //Send Request and await response for route Details
    const routeRes: any = await operationService
      .operationPost("common/getall", routeReq)
      .toPromise();
    //End//
    // Filter departure data based on organization branch
    const departuredata = res.data.filter(
      (x: any) => x.orgLoc.toLowerCase() === orgBranch.toLowerCase() && x.status!=="close" || x.nextUpComingLoc==orgBranch.toLowerCase()
    );
    const routeData = routeRes.data.filter((x) => x.location.toLowerCase() === orgBranch.toLowerCase())
    // Generate table data from filtered departure data
    const tableData = generateTableData(departuredata, routeData);

    // Return the generated table data
    return tableData;
  } catch (error) {
    // Handle error
    throw error;
  }
}

/**
 * Calculates shipment data based on the provided parameters.
 * @param shipmentDetails - The shipment details object.
 * @param orgBranch - The organization branch.
 * @param tableData - The table data.
 * @returns Shipment data object.
 */
function getShipmentData(
  shipmentDetails: any,
  orgBranch: any,
  tableData: any
): any {
  let shipPackage = 0;
  let shipmat = 0;
  let shipmentFilter: any[] = [];

  // Filter shipment data based on organization branch
  shipmentFilter = shipmentDetails.filter(
    (x) => x.orgLoc.toLowerCase() === orgBranch.toLowerCase()
  );

  // Calculate shipPackage and shipmat
  shipmentFilter.forEach((element, index) => {
    shipPackage += parseInt(element.totalChargedNoOfpkg);
    shipmat += index;
  });

  // Create shipData objects
  const createShipDataObject = (
    count: number,
    title: string,
    className: string
  ) => ({
    count,
    title,
    class: `info-box7 ${className} order-info-box7`,
  });

  const shipData = [
    createShipDataObject(tableData.length, "Routes", "bg-white"),
    createShipDataObject(tableData.length, "Vehicles", "bg-white"),
    createShipDataObject(shipmentFilter.length, "Shipments", "bg-white"),
    createShipDataObject(shipPackage, "Packages", "bg-white"),
  ];

  return {
    boxData: shipData,
    tableload: false,
  };
}

/**
 * Generates the dynamic table data based on the provided inputs.
 * @param departureData - The departure data object.
 * @returns Table data array.
 */
function generateTableData(departureData: any[], routeData: any[]): any[] {
  let dataDeparture: any[] = [];
  const { format } = require("date-fns");

  departureData.forEach((element, index) => {
    //let scheduleTime = new Date(); // Replace this with the actual schedule time

    // Convert transHrs to number for time calculations
    //let transHrs = parseInt(element?.transHrs, 10) || 0;

    // Calculate the expected time by adding the transHrs to the schedule time
    //let expectedTime = addHours(scheduleTime, transHrs);

    let action =
      element.tripId === "" && element.lsNo === "" && element.unloading !== ""
        ? "Update Trip"
        : element.tripId !== "" && element.lsNo !== ""
          ? "Vehicle Loading"
          : "Create Trip";
    let routeDetails = routeData.find((x) => x.routeCode == element.routeCode);
    const routeCode = routeDetails?.routeCode ?? 'Unknown';
    const routeName = routeDetails?.routeName ?? 'Unnamed';
    let jsonDeparture = {
      RouteandSchedule: routeCode + ":" + routeName,
      VehicleNo: element?.vehicleNo || "",
      TripID: element?.tripId || "",
      Scheduled: routeDetails.routeStartDate,
      Expected: routeDetails.routeEndDate,
      Hrs: 0,
      Status: "On Time",
      Action: element?.status||"",
      location: element?.location || "",
    };

    dataDeparture.push(jsonDeparture);
  });

  let tableData = dataDeparture;
  return tableData;
}
/**
 * Fetches shipment data from the API based on the provided parameters.
 * @param companyCode - The company code.
 * @param orgBranch - The organization branch.
 * @param tableData - The table data.
 * @param operationService - The operation service for making API requests.
 * @returns A promise that resolves to the shipment result object.
 */
export function fetchShipmentData(
  companyCode: number,
  orgBranch: string,
  tableData: any,
  operationService: any
): any {
  return new Promise((resolve, reject) => {
    // Prepare request payload
    let req = {
      companyCode: companyCode,
      type: "operation",
      collection: "docket",
    };

    // Send request and handle response
    operationService.operationPost("common/getall", req).subscribe({
      next: (res: any) => {
        const shipmentData = res.data;
        const shipmentResult = getShipmentData(
          shipmentData,
          orgBranch,
          tableData
        );
        resolve(shipmentResult);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
}
