import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";


@Injectable({
  providedIn: "root",
})

export class SacService {
  constructor(
    private masterService: MasterService,
    private storage: StorageService
  ) { }
  async getSacDetail() {
    const request = {
      collectionName: 'sachsn_master',
      filter: {}
    };
    const res = await this.masterService.masterPost('generic/get', request).toPromise();
    const sortedData = res.data.sort((a, b) => {
      const A: any = a.SID;
      const B: any = b.SID;

      // Compare the date objects
      return B - A; // Sort in descending order
    });
    return sortedData;
  }
}