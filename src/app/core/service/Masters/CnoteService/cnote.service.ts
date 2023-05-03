import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CnoteService {

  constructor(private http: HttpClient) { }

  getCnoteBooking(ApiURL, req) {
   
    return this.http.get<any>(
      `${environment.APIBaseBetaURL}` + ApiURL + req
    );
  }
   cnotePost(ApiURL, Request) {
    return this.http.post<any>(`${environment.APIBaseBetaURL}` + ApiURL, Request);
  }
  CnoteMongoPost(ApiURL,Request){
    return this.http.post<any>(`${environment.APIMongoUrl}` + ApiURL, Request);
  }
}
