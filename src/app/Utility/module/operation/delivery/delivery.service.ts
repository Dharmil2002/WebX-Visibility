import { Injectable } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { DocketStatus,DocketEvents } from "src/app/Models/docStatus";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { StorageService } from "src/app/core/service/storage.service";


@Injectable({
  providedIn: "root",
})
export class DeliveryService {
  constructor(
    private operation: OperationService,
    private storage: StorageService
  ) { }

  async getDeliveryDetail(filter) {
    
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "drs_details",
      filter: filter
    }
    const res = await firstValueFrom(this.operation.operationMongoPost('generic/get', req));
    return res.data;
  }
  async deliveryUpdate(data, shipment) {
    
    const evnData = shipment.map((item) => {
      const evnData = {
        "_id": `${this.storage.companyCode}${item.dKTNO}-${item.sFX}-${DocketEvents.Delivery_Update}-${moment().format("YYYYMMDDHHmmss")}`,
        "cID": this.storage.companyCode,
        "dKTNO":item.dKTNO,
        "sFX":item.sFX,
        "cNO": null,
        "lOC": this.storage.branch,
        "eVNID":DocketEvents.Delivery_Update,
        "eVNDES":DocketEvents.Delivery_Update.split("_").join(" "),
        "eVNDT": new Date(),
        "eVNSRC": "Delivery Update",
        "dOCTY": "DRS",
        "dOCNO":data.tripId,
        "sTS":data.statusCd,
        "sTSNM": DocketStatus[data.statusCd],
        "oPSSTS":`Delivered to ${item.person} on ${moment(new Date()).tz(this.storage.timeZone).format("DD MMM YYYY @ hh:mm A")}${item.reason ? `, reason: ${item.reason}` : ''}`,
        "eNTLOC": this.storage.branch,
        "eNTBY": this.storage.userName
      }
      return evnData
    })
    data['mODBY']=this.storage.userName;
    data['mODDT']=new Date();
    data['mODLOC']=this.storage.branch;
    const details = {
      formData: data,
      timeZone: this.storage.timeZone,
      shipmentdata: shipment,
      evnData:evnData
    }
    const req={
        companyCode:this.storage.companyCode,
        collectionName:"drs_details",
        data:details
    }
    const res= await firstValueFrom(this.operation.operationMongoPost('operation/drs/deliveryUpdate',req));
    return res;
    
  }
}