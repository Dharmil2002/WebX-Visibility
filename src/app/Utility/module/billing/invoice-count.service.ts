import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InvoiceCountService {

  constructor(private operationService: OperationService,) { }
  //#region to get docket list
  async getDocketCount(filter = {}) {
    try {
      // Prepare the request object
      const req = {
        companyCode: localStorage.getItem("companyCode"),
        filter: filter,
        collectionName: "docket_fin_det",
      };

      // Fetch data from the 'docket' collection using the masterService
      const res = await firstValueFrom(this.operationService.operationPost('generic/get', req));

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
  //#region to get docket list
  async getDocketbilCount(filter = {}) {
    try {
      // Prepare the request object
      const req = {
        companyCode: localStorage.getItem("companyCode"),
        filter: filter,
        collectionName: "dockets",
      };

      // Fetch data from the 'docket' collection using the masterService
      const res = await firstValueFrom(this.operationService.operationPost('generic/get', req));

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
  //#region to get docket list
  async getInvCount(filter = {}) {
    try {
      // Prepare the request object
      const req = {
        companyCode: localStorage.getItem("companyCode"),
        filter: filter,
        collectionName: "cust_bill_headers",
      };

      // Fetch data from the 'docket' collection using the masterService
      const res = await firstValueFrom(this.operationService.operationPost('generic/get', req));

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
  //#region to get Pending count list
  async getPengPodCount(filter = {}) {
    try {
      // Prepare the request object
      const req = {
        companyCode: localStorage.getItem("companyCode"),
        filter: filter,
        collectionName: "docket_ops_det",
      };

      // Fetch data from the 'docket' collection using the masterService
      const res = await firstValueFrom(this.operationService.operationPost('generic/get', req));

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
