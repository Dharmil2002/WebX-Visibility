import { Injectable } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private masterService: MasterService,) { }

  //#region to filter state and get StateName
  async fetchStateByFilterId(filterId: string, filterFieldName: string) {
    try {
      // Retrieve the company code from localStorage
      const companyCode = parseInt(localStorage.getItem("companyCode"));
  
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
}