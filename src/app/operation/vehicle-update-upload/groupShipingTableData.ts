export function groupShipingTableData(shipingTableData) {
    const groupedData = {};
  
    shipingTableData.forEach(element => {
      let leg = element.Leg.trim();
  
      // Check if the leg already exists in the groupedData object
      if (!groupedData.hasOwnProperty(leg)) {
        groupedData[leg] = {
          Leg: leg,
          Shipment: 0,
          Packages: 0,
          WeightKg: 0,
          VolumeCFT: 0
        };
      }
  
      // Increment the shipment count
      groupedData[leg].Shipment += 1;
  
  
      // Calculate Packages, WeightKg, and VolumeCFT for the current leg
      groupedData[leg].Packages += element.Packages;
      groupedData[leg].WeightKg += element.KgWt;
      groupedData[leg].VolumeCFT += element.CftVolume;
    });
  
    // Convert the groupedData object to an array of values
    let shipingTableDataArray = Object.values(groupedData);
  
    return shipingTableDataArray;
  }
  