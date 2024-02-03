import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class TdsMasterService {
  constructor(
    private masterService: MasterService,
    private storage:StorageService
    ) {}

    async getTdsDetails(filter={}, isDropdown = false) {
      try {
        // Create the request object
        const req = {
          companyCode: this.storage.companyCode,
          collectionName: "tds_detail",
          filter: filter
        };
        // Make the API call using the masterService
        const res = await firstValueFrom(this.masterService.masterMongoPost("generic/get", req));
        // Process the response based on the specified requirements
        if (isDropdown) {
          // If it's a dropdown, map the data to a suitable format
          return res.data.map((x) => ({ name: x.TDSsection, value: x.TDScode.toString() }));
        } else {
          // If not a dropdown, return the raw data
          return res.data;
        }
      } catch (error) {
        // Handle any errors that may occur during the API call
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:error,
        });
      }
    }

}
