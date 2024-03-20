import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HawkeyeService {

  constructor(private http: HttpClient) { }
  hawkeyePost(ApiURL, Request){
    return this.http.post<any>(`${environment.APIBaseURL}` + ApiURL, Request);
  }
}
