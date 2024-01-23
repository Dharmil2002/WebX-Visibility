import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private masterService: MasterService) { }
  //#region to get address list
  async getAddressDetail(filter = {}) {
    try {
      // Prepare the request object
      const req = {
        companyCode: localStorage.getItem("companyCode"),
        filter: filter,
        collectionName: "address_detail",
      };

      // Fetch data from the 'docket' collection using the masterService
      const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));

      return res.data;
    } catch (error) {
      // Display error message
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
        showConfirmButton: true,
      });
    }
  }
  //#endregion
}