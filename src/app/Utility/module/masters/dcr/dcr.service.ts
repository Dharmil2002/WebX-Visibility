import { firstValueFrom } from 'rxjs';
import { Collections } from 'src/app/config/myconstants';
import { Injectable } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
    providedIn: 'root'
})
export class DCRService {
    constructor(
      private operation:OperationService,
      private  storage:StorageService
      ) { }
      async getDCR(filter={}){
        const req={
          companyCode:this.storage.companyCode,
          collectionName:"dcr_header",
          filter:filter
        }
        const res= await firstValueFrom(this.operation.operationMongoPost("generic/get",req));
        return res.data
      }
    }
