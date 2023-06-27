export function createRunSheetData(runsheetdata,departRunSheetData) {
    let runSheetDetails = [runsheetdata.runSheetDetails];
    let runSheetShipingDetails = runsheetdata.shippingData;
  
    // Create shipData objects for displaying summary information
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
    });
  
    let runSheetDetailsList:any[] = [];
    runSheetDetails.forEach((element) => {
      let shipingDetails = runSheetShipingDetails.filter((x) => x.Cluster === element.Cluster);
      const totalWeight = shipingDetails.reduce((total, shipment) => total + shipment.Weight, 0);
      const totalCFT = shipingDetails.reduce((total, shipment) => total + shipment.Volume, 0);
      const totalPackages = shipingDetails.reduce((total, shipment) => total + shipment.Packages, 0);
  
      let jsonRunSheet = {
        RunSheet: element?.RunSheetID || '',
        Cluster: element?.Cluster || '',
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
    const shipData = [
      createShipDataObject(csv.length, "Clusters", "bg-white"),
      createShipDataObject(runSheetShipingDetails.length, "Shipments for Delivery", "bg-white"),
      createShipDataObject(pickUpDelivary.length, "Pickup Requests", "bg-white"),
    ];
  
    return {
      csv,
      tableload,
      boxdata: shipData,
    };
  }
  