import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
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
}
