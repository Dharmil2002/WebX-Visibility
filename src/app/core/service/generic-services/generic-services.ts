import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class GenericService { 
 private sharedData: any; 
  constructor() { }
  setSharedData(data: any): void {
    this.sharedData = data;
  }
  getSharedData(): any {
    return this.sharedData;
  }
  clearSharedData(): void {
    this.sharedData = null;
  }
}
