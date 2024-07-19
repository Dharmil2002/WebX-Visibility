export class JobOrderModel {
  _id:string;
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
    this._id=Data?._id || "";
    this.jobNo = Data?.jOBNO || 'System Generated';
    this.vehicleNo = Data?.vEHD?.vEHNO || "";
    this.oem = Data?.vEHD?.oEM || "";
    this.model = Data?.vEHD?.mODEL || "";
    this.orderdate = Data?.jDT || "";
    this.closedate = Data?.closedate || "";
    this.workorders = Data?.wCNO || "";
    this.startKm = Data?.sKM || "";
    this.closeKm = Data?.closeKm || "";
    this.tCost = Data?.tCost || "";
  }
}
