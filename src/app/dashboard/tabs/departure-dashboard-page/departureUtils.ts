import { _Schedule } from "@angular/cdk/table";

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
  operationService: any,
  datePipe
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
      (x: any) => x.orgLoc.toLowerCase() === orgBranch.toLowerCase() && x.status !== "close"
    );
    const routeData = routeRes.data.filter((x) => x.location.toLowerCase() === orgBranch.toLowerCase())
    // Generate table data from filtered departure data
    const tableData = generateTableData(departuredata, routeData, datePipe);

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
function generateTableData(departureData: any[], routeData: any[], datePipe): any[] {
  let dataDeparture: any[] = [];
  const { format } = require("date-fns");

  departureData.forEach((element, index) => {
    //let scheduleTime = new Date(); // Replace this with the actual schedule time

    // Step 1: Create a new Date object for the current date and time
    const currentDate = new Date();

    // Step 2: Add 10 minutes to the Date object for the expected time
    const expectedTime = new Date(currentDate.getTime() + 10 * 60000); // 10 minutes in milliseconds

    // Step 3: Add the transHrs (if required) to the expected time
    // let expectedTimeWithTransHrs = addHours(expectedTime, transHrs);

    // Step 4: Get the schedule time (replace this with your scheduleTime variable)
    const scheduleTime = new Date(); // Replace this line with your actual scheduleTime variable

    // Step 5: Format the dates to strings
    const updatedISOString = expectedTime.toISOString();
    const scheduleTimeISOString = scheduleTime.toISOString();


    let routeDetails = routeData.find((x) => x.routeCode == element.routeCode);
    const routeCode = routeDetails?.routeCode ?? 'Unknown';
    const routeName = routeDetails?.routeName ?? 'Unnamed';
    if(routeDetails){
    let jsonDeparture = {
      RouteandSchedule: routeCode + ":" + routeName,
      VehicleNo: element?.vehicleNo || "",
      TripID: element?.tripId || "",
      Scheduled: datePipe.transform(scheduleTimeISOString, 'dd/MM/yyyy HH:mm'),
      Expected: datePipe.transform(updatedISOString, 'dd/MM/yyyy HH:mm'),
      Hrs: 0,
      Status: "On Time",
      Action: element?.status || "",
      location: element?.location || "",
    };

    dataDeparture.push(jsonDeparture);
  }
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
