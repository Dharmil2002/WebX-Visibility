import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  constructor(private http: HttpClient) {}

  /**
   * Retrieves JSON file details from the specified API URL.
   * @param ApiURL The URL of the JSON file to retrieve.
   * @returns An observable that emits the JSON file details.
   */
  getJsonFileDetails(ApiURL) {
    return this.http.get<any>(this[ApiURL]);
  }
}
