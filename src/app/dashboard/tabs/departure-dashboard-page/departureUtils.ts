import { addHours } from "date-fns";

/**
 * Calculates shipment data based on the provided parameters.
 * @param shipmentDetails - The shipment details object.
 * @param orgBranch - The organization branch.
 * @param tableData - The table data.
 * @returns Shipment data object.
 */
export function getShipmentData(
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
export function generateTableData(departureData: any[]): any[] {
  let dataDeparture: any[] = [];
  const { format } = require("date-fns");

  departureData.forEach((element) => {
    let scheduleTime = new Date(); // Replace this with the actual schedule time

    // Convert transHrs to number for time calculations
    let transHrs = parseInt(element?.transHrs, 10) || 0;

    // Calculate the expected time by adding the transHrs to the schedule time
    let expectedTime = addHours(scheduleTime, transHrs);

    let action =
      element.tripId === "" && element.lsNo === "" && element.unloading !== ""
        ? "Update Trip"
        : element.tripId !== "" && element.lsNo !== ""
        ? "Vehicle Loading"
        : "Create Trip";

    let jsonDeparture = {
      RouteandSchedule: element.rutCd + ":" + element.rutNm,
      VehicleNo: element?.vehicleNo || "",
      TripID: element?.tripId || "",
      Scheduled: format(scheduleTime, "dd-MM-yy HH:mm"),
      Expected: format(expectedTime, "dd-MM-yy HH:mm"),
      Hrs: element?.transHrs || 0,
      VehicleType: element?.VehicleType || "",
      Action: action,
      location: element?.controlLoc || "",
    };

    dataDeparture.push(jsonDeparture);
  });

  let tableData = dataDeparture;
  return tableData;
}
