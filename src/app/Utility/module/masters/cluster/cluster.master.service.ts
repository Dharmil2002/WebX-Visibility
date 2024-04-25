import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";

@Injectable({
    providedIn: "root",
})
export class ClusterMasterService {

    constructor(private masterService: MasterService, private storage: StorageService) {

    }

    async getClusterData(value:string) {
        if (value.length >= 3) {
            const filter = { clusterName: { 'D$regex': `^${value}`, 'D$options': 'i' } }
            const reqBody = {
                companyCode: this.storage.companyCode,
                collectionName: "cluster_detail",
                filter:filter,
            };
            const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
              if(res.data&& res.data.length>0){
                const pincode=res.data.map((data:any)=>data.pincode).flatMap((x)=>x);
                if(pincode && pincode.length>0){
                    const reqBody = {
                        companyCode: this.storage.companyCode,
                        collectionName: "pincode_master",
                        filter:{PIN:{D$in:pincode}}
                  
                    };
                    const pincodes = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
                    if(pincodes.data && pincodes.data.length>0){
                       let cluster=[];
                          res.data.forEach((data:any)=>{
                           const found = pincodes.data.find(x => data.pincode.includes(x.PIN));
                            const json={
                                value:data.clusterName,
                                name: found?.PIN || '',
                                pincode: found?.PIN || '',
                                ct: found?.CT || '',
                                st: found?.ST || '',
                                clusterName: data?.clusterName,
                                clusterId: data?.clusterCode
                            }
                            cluster.push(json);
                          });
                          return cluster;
                    }
                }
               
              }
        }
    }
    async getClusterByPincode(filter) {
        const reqBody = {
            companyCode: this.storage.companyCode,
            collectionName: "cluster_detail",
            filter:filter,
        };
        const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
        return res.data;
    }
}
