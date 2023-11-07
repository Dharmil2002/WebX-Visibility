import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorContractListingService {
  private selectedContractType: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedList: Observable<any[]> = this.selectedContractType.asObservable();

  constructor() { }

  setContractType(value: any[]) {
    this.selectedContractType.next(value);
  }

  getContractType(): Observable<any[]> {
    return this.selectedContractType.asObservable();
  }
}