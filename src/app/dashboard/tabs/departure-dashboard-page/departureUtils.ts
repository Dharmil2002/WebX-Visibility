/**
 * Calculates shipment data based on the provided parameters.
 * @param shipmentDetails - The shipment details object.
 * @param departureData - The departure data object.
 * @param loadingSheetData - The loading sheet data object.
 * @param orgBranch - The organization branch.
 * @param tableData - The table data.
 * @returns An object containing calculated shipment data.
 */
export function getShipmentData(
    shipmentDetails: any,
    departureData: any,
    loadingSheetData: any,
    orgBranch: any,
    tableData: any
  ): any {
    debugger
    const shipmentData = shipmentDetails;
    let shipPackage = 0;
    let shipmat = 0;
    let shipmentFilter:any=[];
    let serviceData:any=[];//this data comes from services 
    // Filter shipment data based on departure or loading sheet data
    if (departureData) {
        serviceData = shipmentData.shippingData.filter(shipment => 
        shipment.Origin === departureData.ArrivalLocation &&
        shipment.routes === departureData.Route
      );
    }else if(loadingSheetData){
        serviceData = shipmentData.shippingData.filter(loading => 
          
            loading.Origin ===  loadingSheetData[0]?.location &&
            loading.Leg ===  loadingSheetData[0]?.Leg)
    }
      // Filter shipment data based on organization branch
    shipmentFilter = shipmentData.shippingData.filter(x => x.Origin === orgBranch);
      if(serviceData.length>0){
      shipmentFilter.push(...serviceData)
      }
    // Calculate shipPackage and shipmat
    shipmentFilter.forEach((element, index) => {
      shipPackage += element.Packages;
      shipmat += index;
    });
    
    // Create shipData objects
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });
    
    const shipData = [
      createShipDataObject(tableData.length, "Routes", "bg-white"),
      createShipDataObject(tableData.length, "Vehicles", "bg-white"),
      createShipDataObject(tableData.length, "Shipments", "bg-white"),
      createShipDataObject(shipPackage, "Packages", "bg-white")
    ];
    
    return {
      boxData: shipData,
      tableload: false
    };
  }
  

 /**
 * Generates the dynamic table data based on the provided inputs.
 * @param {object} departureData - The departure data object.
 * @param {string} orgBranch - The organization branch.
 * @param {object} departure - The departure object.
 * @param {array} loadingSheetData - The loading sheet data array.
 * @returns {array} - The generated table data.
 */
export function generateTableData(departureData, orgBranch, departure, loadingSheetData) {
    let tableArray = departureData['arrivalData'].filter((x) => x.module === 'Departure');
    const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
  
    let dataDeparture = [];
    const { format } = require('date-fns');
    newArray.forEach((element) => {
      let jsonDeparture = {
        RouteandSchedule: element?.Route || '',
        VehicleNo: element?.VehicleNo || '',
        TripID: element?.TripID || '',
        Scheduled: format(new Date(), 'dd-MM-yy HH:mm'),
        Expected: format(new Date(), 'dd-MM-yy HH:mm'),
        Status: element?.Status || 'OnTime',
        Hrs: element?.Hrs || '0:00',
        VehicleType: element?.VehicleType || '',
        Action: element.TripID != '' ? 'Update Trip' : 'Create Trip',
        location: element?.ArrivalLocation || '',
        Leg: element?.Leg || '',
      };
      dataDeparture.push(jsonDeparture);
    });
  
    let tableData = dataDeparture;
  
    if (departure) {
      let currentDate = new Date();
      let formattedDate = currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear();
      let formattedTime = currentDate.getHours() + ':' + currentDate.getMinutes();
      let formattedDateTime = formattedDate + ' ' + formattedTime;
  
      let jsonDeparture = {
        RouteandSchedule: departure?.Route || '',
        VehicleNo: departure?.vehicle || '',
        TripID: departure?.tripID || '',
        Scheduled: formattedDateTime,
        Expected: formattedDateTime,
        Status: 'SCHEDULED',
        Hrs: '17:30',
        VehicleType: 'CANTER 1080',
        Action: 'Update Trip',
        location: departure?.LoadingLocation || '',
        Leg: departure?.Leg || '',
      };
  
      tableData.push(jsonDeparture);
    }
  
    if (loadingSheetData) {
      tableData = tableData.filter((x) => x.RouteandSchedule != loadingSheetData[0].RouteandSchedule);
      tableData.push(loadingSheetData[0]);
    }
  
    return tableData;
  }
  