import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sortArrayByFields } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { MenuData } from 'src/app/layout/sidebar/sidebar.metadata';
import { environment } from 'src/environments/environment';

/**
 * The OperationService class provides methods to retrieve JSON file details from various URLs.
 */
@Injectable({
  providedIn: "root",
})

export class MenuService {

    constructor(private http: HttpClient) { } 

    getMenuData(filter = null) {
        if(!filter) {
            filter =  {
                "IsActive": true
            }
        }
        let req = {
            "collectionName": "menu",
            "filter": filter
        }
        return this.http.post<any>(`${environment.APIBaseURL}generic/get`, req);
    }

    buildHierarchy(items: MenuData[]): MenuData[] {
      
        const itemMap = new Map<string, MenuData>();
        const rootItems: MenuData[] = [];
        // Step 1: Initialize the map and identify root items
        var items: MenuData[] = sortArrayByFields(items, [ "MenuLevel", "ParentId", "DisplayRank", "MenuName"]);
              
        items.forEach((item) => {
          item.SubMenu = []; // Initialize the childs array
          itemMap.set(item.MenuId.toString(), item);
          if (!item.ParentId) {
            rootItems.push(item);
          }
        });
    
        // Step 2: Build the hierarchy
        items.forEach((item) => {
          if (item.ParentId) {
            const parent = itemMap.get(item.ParentId.toString());
            parent?.SubMenu?.push(item);
          }
        });
        return rootItems; // Return the hierarchical structure
      }
}