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
    collectionName: "trip_detail"
  };
  let routeReq = {
    companyCode: companyCode,
    collectionName: "route"
  };

  try {
    // Send request and await response for  trip Detai;s
    const res: any = await operationService
      .operationPost("generic/get", req)
      .toPromise();
    //Send Request and await response for route Details
    const routeRes: any = await operationService
      .operationPost("generic/get", routeReq)
      .toPromise();
    //End//
    // Filter departure data based on organization branch
    const departuredata = res.data.filter(
      (x: any) => x.orgLoc.toLowerCase() === orgBranch.toLowerCase() && x.status !== "close" && x.status !== "depart" && x.status !== "arrival"
    );
    const routeData = routeRes.data;
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
    (x) => x.orgLoc.toLowerCase() === orgBranch.toLowerCase() && x.isComplete && x.lsNo.toLowerCase()=="" 
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
    createShipDataObject(tableData.length, "Routes", "bg-c-Bottle-light"),
    createShipDataObject(tableData.length, "Vehicles", "bg-c-Grape-light"),
    createShipDataObject(shipmentFilter.length, "Shipments", "bg-c-Daisy-light"),
    createShipDataObject(shipPackage, "Packages", "bg-c-Grape-light"),
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
    // Step 1: Get the schedule time (replace this with your actual scheduleTime variable)
    const diffScheduleTime = new Date(updatedISOString); // Replace 'element.scheduleTime' with the actual property containing the schedule time

    // Step 2: Get the expected time (replace this with your actual expectedTime variable)
    const diffSexpectedTime = new Date(scheduleTimeISOString); // Replace 'element.expectedTime' with the actual property containing the expected time

    const timeDifferenceInMilliseconds = diffScheduleTime.getTime() - diffSexpectedTime.getTime();
    const timeDifferenceInHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

    let routeDetails = routeData.find((x) => x.routeCode == element.routeCode);
    const routeCode = routeDetails?.routeCode ?? 'Unknown';
    const routeName = routeDetails?.routeName ?? 'Unnamed';

    if (routeDetails) {
      let jsonDeparture = {
        id:element?._id||"",
        RouteandSchedule: routeCode + ":" + routeName,
        VehicleNo: element?.vehicleNo || "",
        TripID: element?.tripId || "",
        Scheduled: datePipe.transform(scheduleTimeISOString, 'dd/MM/yyyy HH:mm'),
        Expected: datePipe.transform(updatedISOString, 'dd/MM/yyyy HH:mm'),
        Hrs: timeDifferenceInHours.toFixed(2),
        Status: timeDifferenceInHours > 0 ? "Delay" : "On Time",
        Action: element?.status === "depart" ? "" : element?.status === "arrival" ? "" : element?.status,
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
      collectionName: "docket"
    };

    // Send request and handle response
    operationService.operationPost("generic/get", req).subscribe({
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
