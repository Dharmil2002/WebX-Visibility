import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private masterService: MasterService,
    private storage: StorageService,) { }

  //#region to filter state and get StateName
  async fetchStateByFilterId(filterId: string, filterFieldName: string) {
    try {
      // Retrieve the company code from localStorage
      const companyCode = this.storage.companyCode;

      // Prepare the request object
      const stateFetchRequest = {
        companyCode,
        collectionName: 'state_master',
        filter: { [filterFieldName]: filterId }
      };

      // Fetch state data from the masterService asynchronously
      const stateResponse = await this.masterService.masterPost('generic/get', stateFetchRequest).toPromise();

      // Check if data is available in the response
      if (stateResponse.data && stateResponse.data.length > 0) {
        return stateResponse.data;
      }

      // Return null if no data is found
      return null;
    } catch (error) {
      console.error('Error fetching state data:', error);
      throw error;
    }
  }
  //#endregion

  //#region to get state list
  async getState() {
    try {
      // Retrieve the company code from localStorage
      const companyCode = this.storage.companyCode;

      // Prepare the request object
      const stateFetchRequest = {
        companyCode,
        collectionName: 'state_master',
        filter: {}
      };

      // Fetch state data from the masterService asynchronously
      const stateResponse = await firstValueFrom(this.masterService.masterPost('generic/get', stateFetchRequest));

      // Check if data is available in the response
      if (stateResponse.data && stateResponse.data.length > 0) {
        // Map the response data to the desired format
        const mappedStates = stateResponse.data.map((stateData: any) => {
          return {
            name: stateData.STNM, value: stateData.ST
          };
        });

        // Return the mapped states
        return mappedStates;
      }

      // Return an empty array if no data is found
      return [];
    } catch (error) {
      console.error('Error fetching state data:', error);
      throw error;
    }
  }

  //#endregion
  //#region to get state list
  async getStateWithZone(filter = {}): Promise<any> {
    try {
      // Retrieve the company code from localStorage
      const companyCode = this.storage.companyCode;

      // Prepare the request object for fetching state data
      const stateFetchRequest = {
        companyCode,
        collectionName: 'state_master',
        filter: filter
      };

      // Fetch state data from the masterService asynchronously
      const stateResponse = await firstValueFrom(this.masterService.masterPost('generic/get', stateFetchRequest));

      // Return the fetched states or an empty array if no data is found
      return stateResponse.data || [];

    } catch (error) {
      console.error('Error fetching state data:', error);
      throw error;
    }
  }

  //#endregion
  getGSTType(fromState: any, toState: any): { CGST: boolean, IGST: boolean, SGST: boolean, UGST: boolean } {

    if (fromState.ST == toState.ST && (fromState.ISUT || toState.ISUT)) {
      return { CGST: true, IGST: false, SGST: false, UGST: true };
    }
    if (fromState.ST == toState.ST && !fromState.ISUT && !toState.ISUT) {
      return { CGST: true, IGST: false, SGST: true, UGST: false };
    }
    else if (fromState.ST != toState.ST) {
      return { CGST: false, IGST: true, SGST: false, UGST: false };
    }
    return { CGST: false, IGST: true, SGST: false, UGST: false };
  }
  async checkGst(supplierGstNo: string, consumerGstNo: string): Promise<{ CGST: boolean, IGST: boolean, SGST: boolean, UTGST: boolean }> {
    const sGstNo = supplierGstNo.trim().substring(0, 2);
    const cGstNo = consumerGstNo.trim().substring(0, 2);
    if (sGstNo !== cGstNo) {
      return { CGST: false, IGST: true, SGST: false, UTGST: false };
    } else {
      const gstDetail = await this.fetchStateByFilterId(cGstNo, "ST");
      if (gstDetail[0].ISUT) {
        return { CGST: true, IGST: false, SGST: false, UTGST: true };
      }
      return { CGST: true, IGST: false, SGST: true, UTGST: false };
    }
  }
}