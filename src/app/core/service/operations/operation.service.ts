import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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
  constructor(private http: HttpClient) { }
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
  operationMongoRemove(ApiURL,Request){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = {
      headers: headers,
      body: Request
    };
      return this.http.delete<any>(`${environment.APIBaseURL}` + ApiURL,options);
    }
  setShipmentStatus(data: string) {
    this.shipmentStatus = data
  }
  getShipmentStatus() {
    return this.shipmentStatus
  }
}
