import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { GenericActions, StoreKeys } from 'src/app/config/myconstants';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage.service';

/**
 * The OperationService class provides methods to retrieve JSON file details from various URLs.
 */
@Injectable({
  providedIn: "root",
})
export class OperationService {
  departureJsonUrl = '../../../assets/data/departureDetails.json';
  loadingJsonUrl = '../../../assets/data/vehicleType.json';
  loadingSheetJsonUrl = '../../../assets/data/shipmentDetails.json';
  arrivalUrl = '../../../assets/data/arrival-dashboard-data.json';
  runSheerUrl = "../../../assets/data/create-runsheet-data.json";
  podcodDetails = '../../../assets/data/pod-data.json';
  shipmentStatus: string;
  constructor(private http: HttpClient, private storage: StorageService) { }
  /**
   * Retrieves JSON file details from the specified API URL.
   * @param ApiURL The URL of the JSON file to retrieve.
   * @returns An observable that emits the JSON file details.
   */

  getJsonFileDetails(ApiURL) {
    return this.http.get<any>(this[ApiURL]);
  }
  //here is create for post request//
  operationPost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  operationPut(ApiURL, Request) {
    return this.http.put<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  //here is create for post request//
  operationMongoPost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  operationMongoPut(ApiURL, Request) {
    return this.http.put<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  operationMongoRemove(ApiURL, Request) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = {
      headers: headers,
      body: Request
    };
    return this.http.delete<any>(`${environment.APIBaseURL}` + ApiURL, options);
  }
  setShipmentStatus(data: string) {
    this.shipmentStatus = data
  }
  getShipmentStatus() {
    return this.shipmentStatus
  }
  async GetPaginatedData(FiltersRequestBody, CollectionName, pageSize = 1000, maxRequestCount = 5) {
    let allData = [];
    let page = 0;
    let requestCount = 0;
    let hasMoreData = true;

    try {
      while (hasMoreData && requestCount < maxRequestCount) {
        const reqBody = {
          companyCode: parseInt(this.storage.getItem(StoreKeys.CompanyCode)),
          collectionName: CollectionName,
          filters: [
            { D$match: FiltersRequestBody.filter },
            { D$sort: { _id: 1 } },
            { D$skip: page * pageSize },
            { D$limit: pageSize }
          ]
        };

        const res = await firstValueFrom(this.operationPost(GenericActions.Query, reqBody));

        if (res && res.data) {
          allData = allData.concat(res.data);
          requestCount++; // Increment the request count

          if (res.data.length < pageSize) {
            // If the returned data is less than the page size, we have fetched all the data
            hasMoreData = false;
          } else {
            page++; // Increment the page number to fetch the next set of data
          }
        } else {
          // If an error occurs, stop fetching
          hasMoreData = false;
          return { message: "An error occurred", data: allData, success: false };
        }
      }

      return { data: allData, success: true, message: "Data fetched successfully" };
    } catch (error) {
      console.error('An error occurred:', error);
      return { message: "An error occurred", data: [], success: false };
    }
  }



}
