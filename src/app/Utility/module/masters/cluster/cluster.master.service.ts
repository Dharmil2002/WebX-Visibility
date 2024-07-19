import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import { chunkArray } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import _ from 'lodash';
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
            try {
                // Chunk pinCodes into arrays of 500
                const pincodeChunks = chunkArray(pinCodes, 1000);
            
                // Array to collect all clusters from API calls
                let allClusters = [];
            
                // Iterate over each chunk and make API calls
                for (const chunk of pincodeChunks) {
                  try {
                    const clusterRequestBody = {
                      companyCode: this.storage.companyCode,
                      collectionName: 'cluster_detail',
                      filter: {
                        pincode: { D$in: chunk },
                        cLSTYPNM: 'Area'
                      }
                    };
                    const clusterResponse = await firstValueFrom(this.masterService.masterMongoPost('generic/get', clusterRequestBody));
                    allClusters = [...allClusters, ...clusterResponse?.data || []]; // Collect clusters from MongoDB response
                  } catch (err) {
                    console.log(err); // Handle errors if necessary
                  }
                }

                let data = [];
                pinResponse.data.map((d) => {
                  data.push({
                    name: `${d.PIN}`,
                    value: `${d.CT}`,
                    ct: d.CT,
                    pincode: d.PIN,
                    st: d.ST,
                    clusterName: "",
                    clusterId: ""
                  });

                  const clusters = allClusters.filter(x => x.pincode.includes(d.PIN));
                  if(clusters.length > 0) {
                    clusters.forEach((c: any) => {
                      data.push({
                        name: `${d.PIN}`,
                        value: `${d.CT}`,
                        ct: d.CT,
                        pincode: d.PIN,
                        st: d.ST,
                        clusterName: c?.clusterName || "",
                        clusterId: c?.clusterCode || ""
                      });
                    });
                  }
                });

                // const data = pinResponse.data.reduce((acc, obj) => {
                //     // Check if there's already an entry with the same CT and PIN
                //     const existingItemIndex = acc.findIndex(item => item.ct === obj.CT && item.pincode === obj.PIN);
                    
                //     if (existingItemIndex === -1) {
                //       // If no such entry exists, add it to the accumulator array
                //       findClusters(allClusters, obj, acc);
                //     } else {
                //       // If an entry with the same CT and PIN already exists, update it if needed
                //       const existingItem = acc[existingItemIndex];
                //       const getCluster = allClusters.find(x => x.pincode.includes(obj.PIN)) || "";
                //       // Update fields if needed (optional)
                //       existingItem.st = obj.ST;
                //       existingItem.clusterName = getCluster?.clusterName || "";
                //       existingItem.clusterId = getCluster?.clusterCode || "";
                //     }
                    
                //     return acc;
                //   }, []);
                console.log(data);  
                return data;            
              } catch (err) {
                console.log(err);
                return []; // Return empty array or handle error appropriately
              }
        } catch (error) {
            console.error('Failed to fetch cluster data:', error);
        }

      function findClusters(allClusters: any[], obj: any, acc: any) {
        const pincodeClusters = allClusters.filter(x => x.pincode.includes(obj.PIN));
        if (pincodeClusters.length > 0) {
          pincodeClusters.forEach((getCluster: any) => {
            acc.push({
              name: `${obj.PIN}`,
              value: `${obj.CT}`,
              ct: obj.CT,
              pincode: obj.PIN,
              st: obj.ST,
              clusterName: getCluster?.clusterName || "",
              clusterId: getCluster?.clusterCode || ""
            });
          });
        }
        else {
          acc.push({
            name: `${obj.PIN}`,
            value: `${obj.CT}`,
            ct: obj.CT,
            pincode: obj.PIN,
            st: obj.ST,
            clusterName: "",
            clusterId: ""
          });
        }
      }
    }


}
