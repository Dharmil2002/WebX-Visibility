import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage;

  constructor() {
    this.storage = localStorage; // or sessionStorage
  }

  get companyCode(): number {
    return this.getItemObject<number>("companyCode");
  }
  get companyCd(): string {
    return this.getItem("company_Code");
  }

  get branch(): string {
    return this.getItem("Branch");
  }

  get userName(): string {
    return this.getItem("UserName");
  }

  get mode(): string {
    return this.getItem("Mode");
  }
  get companyLogo(): string {
    return this.getItem("companyLogo");
  }
  get timeZone(): string {
    return this.getItem("companyLogo");
  }

  setItem(key: string, value: any, useSessionStorage = false): void {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.storage.setItem(key, value);
  }
  
  getItemObject<T>(key: string, useSessionStorage = false): T | null {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    const item = this.storage.getItem(key);
  
    if (item !== null) {
      try {
        const parsedItem = JSON.parse(item) as T;
        return parsedItem;
      } catch (error) {
        console.error("Error parsing item:", error);
        return null;
      }
    }
  
    return null;
  }

  getItem(key: string, useSessionStorage = false): string | null {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    const item = this.storage.getItem(key);
  
    return item !== null ? item : null;
  }
  

  removeItem(key: string, useSessionStorage = false): void {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.storage.removeItem(key);
  }

  clear(useSessionStorage = false): void {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.storage.clear();
  }
}
