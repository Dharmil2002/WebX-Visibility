// This utility function groups shipments by leg
export function groupShipmentsByLeg(shipingTableData) {
    let groupedData = {};
  
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
  
    return Object.values(groupedData);
  }

  export async function updateTracking(companyCode, operationService,dktNo) {

    const dockData = {
      status:"Going to Last Mile Delivery"+" "+localStorage.getItem("Branch"),
      upBy:localStorage.getItem("Username"),
      evnCd:"",
      upDt:new Date().toISOString(),
      loc:localStorage.getItem("Branch")
    }
  
    const req = {
      companyCode: companyCode,
      type: "operation",
      collection: "docket_tracking",
      id: dktNo,
      updates: {
        ...dockData
      }
    };
  
    try {
      const res: any = await operationService.operationPut("common/update", req).toPromise();
       return res;
    } catch (error) {
      console.error("Error update a docket Status:", error);
      return null;
    }
  }
  