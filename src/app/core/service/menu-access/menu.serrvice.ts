import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * The OperationService class provides methods to retrieve JSON file details from various URLs.
 */
@Injectable({
  providedIn: "root",
})

export class MenuService {

    constructor(private http: HttpClient) { } 

    getMenuData() {
        let req = {
            "collectionName": "menu",
            "filter": {
                "IsActive": true
            }
        }
        return this.http.post<any>(`${environment.APIBaseURL}generic/get`, req);
    }
}