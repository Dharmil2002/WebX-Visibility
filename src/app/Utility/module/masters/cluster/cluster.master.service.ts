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

    async getClusterData(value: string) {
        if (value.length >= 3) {
            const filter = { clusterName: { 'D$regex': `^${value}`, 'D$options': 'i' }, cLSTYPNM: "Area" }
            const reqBody = {
                companyCode: this.storage.companyCode,
                collectionName: "cluster_detail",
                filter: filter,
            };
            const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
            if (res.data && res.data.length > 0) {
                const pincode = res.data.map((data: any) => data.pincode).flatMap((x) => x);
                if (pincode && pincode.length > 0) {
                    const reqBody = {
                        companyCode: this.storage.companyCode,
                        collectionName: "pincode_master",
                        filter: { PIN: { D$in: pincode } }

                    };
                    const pincodes = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
                    if (pincodes.data && pincodes.data.length > 0) {
                        let cluster = [];
                        res.data.forEach((data: any) => {
                            const found = pincodes.data.find(x => data.pincode.includes(x.PIN));
                            const json = {
                                value: data.clusterName,
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
            filter: filter,
        };
        const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", reqBody));
        return res.data;
    }
    async getClusterCityMapping(filter) {
        const pincodeRequestBody = {
            companyCode: this.storage.companyCode,
            collectionName: "pincode_master",
            filter: filter,
        };
        try {
            const pinResponse = await firstValueFrom(this.masterService.masterMongoPost("generic/get", pincodeRequestBody));
            if (!pinResponse.data || pinResponse.data.length === 0) {
                return []; // Return empty array if no pincodes are found
            }

            const pinCodes = pinResponse.data.map(item => item.PIN);
            const clusterRequestBody = {
                companyCode: this.storage.companyCode,
                collectionName: "cluster_detail",
                filter: { pincode: { D$in: pinCodes },cLSTYPNM: "Area"  }  // Assuming '$in' is the correct operator
            };

            const clusterResponse = await firstValueFrom(this.masterService.masterMongoPost("generic/get", clusterRequestBody));
                const data = Array.from(new Set(pinResponse.data.map(obj => obj.CT)))
                .map(ct => {
                    // Find the first occurrence of this ct in the original data to get its pincode
                    const originalItem =pinResponse.data.find(item => item.CT === ct);
                    const getCluster = clusterResponse?.data.find(x => x.pincode.includes(originalItem.PIN))||"";
                    return {
                      name: `${originalItem.PIN}`,
                      value:`${ct}`,
                      ct: ct,
                      pincode: originalItem.PIN, // include pincode here
                      st: originalItem?.ST,
                      clusterName: getCluster?.clusterName||"",
                      clusterId: getCluster?.clusterCode||""
                    };
                  });
                return data;
        } catch (error) {
            console.error('Failed to fetch cluster data:', error);
        }
    }


}
