import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class CnoteService {

  constructor(private http: HttpClient) { }
  GetCnoteFormcontrol() {
    return this.http.get<any>(
      `https://cnoteentry.azurewebsites.net/api/cnotefields`
    );
  }
}
