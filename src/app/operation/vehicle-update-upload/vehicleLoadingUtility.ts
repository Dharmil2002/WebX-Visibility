export async function updateTracking(companyCode,operationService,data,dktNo) {
   
    const dockData = {
       mfno:data?.mfNo||"",
       status:"Waiting for Depart",
       loc: localStorage.getItem("Branch"),
       evnCd:"",
       upBy:localStorage.getItem("Username"),
       upDt:new Date().toUTCString()
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
   