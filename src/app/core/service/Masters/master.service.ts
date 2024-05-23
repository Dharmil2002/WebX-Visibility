import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import * as StorageService from '../storage.service';
import { StoreKeys } from 'src/app/config/myconstants';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  docketDataUrl = '../../../assets/data/docketData.json';
  guiColumnUrl = '../../../assets/data/guiColumn.json';
  companyJsonUrl = '../../../assets/data/CompanyGST-data.json';
  dropDownUrl = '../../../assets/data/state-countryDropdown.json';
  masterUrl = '../../../assets/data/masters-data.json';
  ewayUrl = '../../../assets/data/ewayData.json';
  customer = '../../../assets/data/customer.json';
  city = '../../../assets/data/city.json';
  generalMaster = '../../../assets/data/generalMaster.json';
  destination = '../../../assets/data/destination.json';
  rakeUpdate = '../../../assets/data/rake-update.json';
  jobtracker = '../../../assets/data/job-tracker.json';
  pending = '../../../assets/data/pending.json';
  invoice = '../../../assets/data/invoice.json';
  search = '../../../assets/data/search.json';
  manualVoucher = '../../../assets/data/manual-voucher.json';
  headerCode: string;
  vehicleDetail: any;
  containerTypeUrl = '../../../assets/data/containerType.json'
  countryList = '../../../assets/data/country.json'
  vendorGst: any;
  customerGst: any;
  companyGst: any;
  businessTypeList = '../../../assets/data/businessType.json'
  thcDetail = '../../../assets/data/thc-viewprint.json'
  vendorGstReport = '../../../assets/ReportFiles/vendorGstReport.json';
  generalLedgerReport = '../../../assets/ReportFiles/generalLedger.json';

  constructor(private http: HttpClient) { }
  /**
   * Retrieves JSON file details from the specified API URL.
   * @param ApiURL The URL of the JSON file to retrieve.
   * @returns An observable that emits the JSON file details.
   */
  getJsonFileDetails(ApiURL) {
    return this.http.get<any>(this[ApiURL]);
  }
  masterPost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  masterPut(ApiURL, Request) {
    return this.http.put<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  masterMongoPost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  masterMongoPut(ApiURL, Request) {
    return this.http.put<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  masterMongoRemove(ApiURL, Request) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const options = {
      headers: headers,
      body: Request
    };

    return this.http.delete<any>(`${environment.APIBaseURL}` + ApiURL, options);
  }
  setValueheaderCode(data: string) {
    this.headerCode = data
  }
  setValueVendorGst(data: any) {
    this.vendorGst = data;
  }

  sendRequest(config: any): Observable<any> {
    const { url, method, request } = config;
    const apiUrl = `${environment.APIBaseURL}${url}`;

    switch (method.toUpperCase()) {
      case 'POST':
        return this.http.post(apiUrl, request);
      case 'PUT':
        return this.http.put(apiUrl, request);
      case 'GET':
        // Add logic for GET requests if needed
        break;
      // Add more cases for other HTTP methods as needed
      default:
        break;
    }
  }
  getHeaderCode() {
    return this.headerCode
  }
  setassignVehicleDetail(data: any) {
    this.vehicleDetail = data;
  }
  getAssigneVehicleDetail() {
    return this.vehicleDetail
  }
  getVendor() {
    return this.vendorGst;
  }
  setValueCustomerGst(data: any) {
    this.customerGst = data;
  }
  getCustomer() {
    return this.customerGst;
  }
  setValueCompanyGst(data: any) {
    this.companyGst = data;
  }
  getCompany() {
    return this.companyGst;
  }

  async getGeneralMasterData(codeType) {
    let reqBody = {
      companyCode: StorageService.getItem(StoreKeys.CompanyCode),
      collectionName: "General_master",
      filter: { activeFlag: true },
    };

    if (codeType) {
      reqBody.filter["codeType"] = Array.isArray(codeType) ?
        { D$in: codeType } :
        { D$eq: codeType };
    }

    try {
      const res = await firstValueFrom(await this.masterPost("generic/get", reqBody));

      // Use the correct filter condition with a return statement
      return res.data;
    } catch (error) {
      console.error("An error occurred:", error);
      return [];
    }
  }
  /**
   * Retrieves the last ID from a collection based on the provided parameters.
   * If the ID is not found or an error occurs, it returns a default ID with the specified prefix.
   *
   * @param collectionName - The name of the collection to retrieve the last ID from.
   * @param companyCode - The company code used as a filter for the collection.
   * @param cIDField - The field name used to filter the collection based on the company code.
   * @param idField - The field name representing the ID in the collection.
   * @param prefix - The prefix to be added to the default ID.
   * @returns A Promise that resolves to the last ID or a default ID.
   */
  async getLastId(collectionName: string, companyCode: number, cIDField: string, idField: string, prefix: string): Promise<string> {
    const req = {
      companyCode: companyCode,
      collectionName: collectionName,
      filter: { [cIDField]: companyCode },
      sorting: { [idField]: -1 },
    };

    try {
      const response = await firstValueFrom(this.masterPost("generic/findLastOne", req));
      // Default to `${prefix}00000` if `response.data` is falsy or doesn't contain `idField`
      const lastId = response?.data?.[idField] ?? `${prefix}00000`;
      return lastId;
    } catch (error) {
      console.error("Error fetching the last ID:", error);
      // Return default ID if there is an error
      return `${prefix}00000`;
    }
  }
}