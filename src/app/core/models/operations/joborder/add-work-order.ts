export class WorkOrderModel {
  _id:string;
  vehiclenumber: string;
  oem: string;
  model: string;
  orderNo: string;
  orderdate: Date;
  ordercategory: string;
  subcategory: string;
  workshoptype: string;
  vendor: any;
  location: any;
  sentdate: Date;
  estimatereturndate: Date;
  actualreturndate: Date;
  startKmRead: number;
  closeKmRead: string;
  ServiceKm: string;
  handedover: any;
  supervisor: any;
  returnto: string;
  constructor(Data) {
    this._id=Data?._id || "";
    this.vehiclenumber = Data?.vEHNO || "";
    this.oem = Data?.vEHD?.oEM || "";
    this.model = Data?.vEHD?.mODEL || "";
    this.orderNo = Data?.jOBNO || "";
    this.orderdate = Data?.jDT || "";
    this.ordercategory = Data?.cATEGORY || "";
    this.subcategory = Data?.sCATEGORY || "";
    this.workshoptype = Data?.tYPE || "";
    this.vendor = Data?.vEND || "";
    this.location = Data?.vLOC || "";
    this.sentdate = Data?.sDT || new Date();
    this.estimatereturndate = Data?.eRDT || new Date();
    this.actualreturndate = Data?.aRDT || new Date();
    this.startKmRead = Data?.sKM || "";
    this.closeKmRead = Data?.closeKmRead || "";
    this.ServiceKm = Data?.ServiceKm || "";
    this.handedover = Data?.hOBYD || "";
    this.supervisor = Data?.sUPVD || "";
    this.returnto = Data?.returnto || "";
  }
}