// session.service.ts
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private companyCodeKey = 'companyCode';
  constructor(private storageService: StorageService) {
  }
  getCompanyCode(): number | null {
    const companyCodeString = this.storageService.getItem(this.companyCodeKey);
    return companyCodeString ? parseInt(companyCodeString, 10) : null;
  }

  setCompanyCode(companyCode: number): void {
    this.storageService.setItem(this.companyCodeKey, companyCode.toString());
  }

  clearCompanyCode(): void {
    this.storageService.removeItem(this.companyCodeKey);
  }
}
