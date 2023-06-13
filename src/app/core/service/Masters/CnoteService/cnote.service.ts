import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CnoteService {
  private savedData: any;
  private Departure:any;
  private loadingSheetData:any;
  private vehicleLoadingData:any;
  //tab:number;
  getData(): any {
    return this.savedData;
  }
  setData(data: any): void {
    this.Departure = data;
  } 
  getDeparture():any{
    return this.Departure;
  }
  setDeparture(data: any): void {
    this.Departure = data;
  } 
  setLsData(data:any){
    this.loadingSheetData = data;
  }
  getLsData(){
    return this.loadingSheetData
  }
  setvehicelodingData(data:any){
    this.vehicleLoadingData=data;
  }
  getVehicleLoadingData(){
    return this.vehicleLoadingData;
  }
  constructor(private http: HttpClient) { }
  // GetCnoteFormcontrol() {
  //   return this.http.get<any>(
  //     `http://localhost:3000/api/`
  //   );
  // }
  getCnoteBooking(ApiURL, req) {
   
    return this.http.get<any>(
      `${environment.APIBaseURL}` + ApiURL + req
    );
  }
   cnotePost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
  cnoteNewPost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseBetaURL}` + ApiURL, Request);
  }
  CnoteMongoPost(ApiURL,Request){
    return this.http.post<any>(`${environment.APIMongoUrl}` + ApiURL, Request);
  }
}
