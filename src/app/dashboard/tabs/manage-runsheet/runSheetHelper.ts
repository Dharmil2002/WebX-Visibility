export function createRunSheetData(runsheetdata,departRunSheetData,apiData) {
 
    let runSheetDetails,runSheetShipingDetails
    if(apiData){
     runSheetDetails = [runsheetdata.runSheetDetails];
     runSheetShipingDetails = runsheetdata.shippingData;
    }
    else{
    runSheetDetails = runsheetdata.cluster.filter((x)=>x.action==="Depart");
    runSheetShipingDetails = runsheetdata.shipment;
    }
    // Create shipData objects for displaying summary information
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
    });
  
    let runSheetDetailsList:any[] = [];
    runSheetDetails.forEach((element) => {
      let shipingDetails = runSheetShipingDetails.filter((x) => x.cluster === element.cluster);
      const totalWeight = shipingDetails.reduce((total, shipment) => total + shipment.weight, 0);
      const totalCFT = shipingDetails.reduce((total, shipment) => total + shipment.volume, 0);
      const totalPackages = shipingDetails.reduce((total, shipment) => total + shipment.packages, 0);
  
      let jsonRunSheet = {
        RunSheet: element?.runSheetID || '',
        Cluster: element?.cluster || '',
        Shipments: shipingDetails.length,
        Packages: totalPackages,
        WeightKg: totalWeight,
        VolumeCFT: totalCFT,
        Status: "GENERATED",
        Action: "Depart",
      };
      runSheetDetailsList.push(jsonRunSheet);
    });
  
    let updatedData =departRunSheetData;
    let csv:any = [];
    let tableload = false;
    if (updatedData) {
      runSheetDetailsList.forEach((element) => {
        if (element.Cluster === updatedData.Cluster) {
          element.Status = updatedData.Status;
          element.Action = updatedData.Action;
        }
      });
      csv = runSheetDetailsList;
      tableload = false;
    } else {
      csv = runSheetDetailsList;
      tableload = false;
    }
  
    if (updatedData) {
      csv.forEach((element) => {
        if (element.Cluster === updatedData.Cluster) {
          element.Status = updatedData.Status;
          element.Action = updatedData.Action;
        }
      });
    }
  
    let pickUpDelivary = runSheetDetails.filter((x) => x.Pickup === true);
    let ShipmentsDelivery = runSheetDetails.filter((x) => x.Delivery === true);
    const shipData = [
      createShipDataObject(csv.length, "Clusters", "bg-c-Bottle-light"),
      createShipDataObject(ShipmentsDelivery.length, "Shipments for Delivery", "bg-c-Grape-light"),
      createShipDataObject(pickUpDelivary.length, "Pickup Requests", "bg-c-Daisy-light"),
    ];
  
    return {
      csv,
      tableload,
      boxdata: shipData,
    };
  }
  