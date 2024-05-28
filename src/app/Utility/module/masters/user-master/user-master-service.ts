import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { vehicleMarket } from 'src/app/Models/vehicle-market/vehicle-market';
import { Collections, GenericActions } from 'src/app/config/myconstants';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
    providedIn: 'root'
})

export class UserMasterService {
    constructor(private masterService: MasterService, private storage: StorageService) { }
    async getUserName(filter) {
        const req = {
            companyCode: this.storage.companyCode,
            collectionName: "user_master",
            filter: filter
        };
        return await firstValueFrom(this.masterService.masterPost("generic/get", req));
    }
}