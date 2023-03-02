import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CnoteService {

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
}
