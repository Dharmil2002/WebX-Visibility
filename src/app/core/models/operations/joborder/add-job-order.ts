export class JobOrderModel {
    jobNo:string;
    vehicleNo: string;
    oem: string;
    model: string;
    orderdate: Date;
    closedate: Date;
    workorders: string;
    startKm: number;
    closeKm:string;
    tCost:string;
    constructor(Data) {
      this.jobNo = Data?.jobNo || 'System Generated';
      this.vehicleNo = Data?.vehicleNo || "";
      this.oem = Data?.oem || "";
      this.model = Data?.model || "";
      this.orderdate = Data?.orderdate || "";
      this.closedate = Data?.closedate || "";
      this.workorders = Data?.workorders || 0;
      this.startKm = Data?.startKm || "";
      this.closeKm = Data?.closeKm || "";
      this.tCost = Data?.tCost || "";
    }
  }
  