import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  companyJsonUrl = '../../../assets/data/CompanyGST-data.json';
  constructor(private http: HttpClient) { }
  /**
   * Retrieves JSON file details from the specified API URL.
   * @param ApiURL The URL of the JSON file to retrieve.
   * @returns An observable that emits the JSON file details.
   */
  getJsonFileDetails(ApiURL) {
    return this.http.get<any>(this[ApiURL]);
  }
}
