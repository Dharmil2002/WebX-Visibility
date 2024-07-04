import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private menuItemData: any;
  constructor() {}
  setMenuItemData(data: any) {
    this.menuItemData = data;
  }
  getMenuItemData() {
    return this.menuItemData;
  }
}