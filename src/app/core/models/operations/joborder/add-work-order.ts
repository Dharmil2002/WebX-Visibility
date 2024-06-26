export class WorkOrderModel {
  vehiclenumber: string;
  oem: string;
  model: string;
  orderNo: string;
  orderdate: Date;
  ordercategory: string;
  subcategory: string;
  workshoptype: string;
  vendor: string;
  location: string;
  sentdate: Date;
  estimatereturndate: Date;
  actualreturndate: Date;
  startKmRead: number;
  closeKmRead: string;
  ServiceKm: string;
  handedover: string;
  supervisor: string;
  returnto: string;
  maintenancesvcdetails: MaintenanceSvcDetails[];

  constructor(Data) {
    this.vehiclenumber = Data?.vehiclenumber || "";
    this.oem = Data?.oem || "";
    this.model = Data?.model || "";
    this.orderNo = Data?.orderNo || "";
    this.orderdate = Data?.orderdate || "";
    this.ordercategory = Data?.ordercategory || "";
    this.subcategory = Data?.subcategory || "";
    this.workshoptype = Data?.workshoptype || "";
    this.vendor = Data?.vendor || "";
    this.location = Data?.location || "";
    this.sentdate = Data?.sentdate || new Date();
    this.estimatereturndate = Data?.estimatereturndate || new Date();
    this.actualreturndate = Data?.actualreturndate || new Date();
    this.startKmRead = Data?.startKmRead || "";
    this.closeKmRead = Data?.closeKmRead || "";
    this.ServiceKm = Data?.ServiceKm || "";
    this.handedover = Data?.handedover || "";
    this.supervisor = Data?.supervisor || "";
    this.returnto = Data?.returnto || "";
    this.maintenancesvcdetails = Data?.MaintenanceSvcDetails || [];
  }
}
export class MaintenanceSvcDetails {
  TaskGroup: string;
  constructor(Data) {
    this.TaskGroup = Data?.TaskGroup || "";
  }
}
