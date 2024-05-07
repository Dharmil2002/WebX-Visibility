import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EncryptionService } from './encryptionService.service';
import { StoreKeys } from 'src/app/config/myconstants';
import * as CryptoService from './encryptionService.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  private storageSubscriptions = new Map<string, BehaviorSubject<string | null>>();

  private storage: Storage;

  constructor(private crypto: EncryptionService) {
    this.storage = localStorage; // or sessionStorage    
  }

  watchStorage(key: string): Observable<string | null> {
    if (!this.storageSubscriptions.has(key)) {
      this.storageSubscriptions.set(key, new BehaviorSubject<string | null>(this.storage.getItem(key)));
    }
    return this.storageSubscriptions.get(key)!.asObservable();
  }

  get token(): string {
    return this.getItem(StoreKeys.Token);
  }

  set token(value: string) {
     this.setItem(StoreKeys.Token, value);
  }

  get refreshToken(): string {
    return this.getItem(StoreKeys.RefreshToken);
  }

  set refreshToken(value: string) {
    this.setItem(StoreKeys.RefreshToken, value);
  }

  get companyCode(): number {
    return this.getItemObject<number>(StoreKeys.CompanyCode);
  }
  get companyCd(): string {
    return this.getItem(StoreKeys.CompanyAlias);
  }

  get branch(): string {
    return this.getItem(StoreKeys.Branch);
  }

  get userName(): string {
    return this.getItem(StoreKeys.UserId);
  }

  get loginName(): string {
    return this.getItem(StoreKeys.UserName);
  }

  get mode(): string {
    return this.getItem(StoreKeys.Mode);
  }
  get companyLogo(): string {
    return this.getItem(StoreKeys.CompanyLogo);
  }
  get timeZone(): string {
    return this.getItem(StoreKeys.TimeZone);
  }

  get menu(): string {
    return this.getItem(StoreKeys.Menu);
  }

  get menuToBind(): string {
    return this.getItem(StoreKeys.MenuToBind);
  }

  get docNames(): string {
    return this.getItem(StoreKeys.DocNames);
  }

  setItem(key: string, value: any, useSessionStorage = false): void {    
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    let storeValue = value;
    if(key != StoreKeys.Token && key != StoreKeys.RefreshToken) {
      storeValue = this.crypto.encrypt(value);
    }
    this.storage.setItem(key, storeValue);
    this.notifySubscribers(key);
  }
  
  getItemObject<T>(key: string, useSessionStorage = false): T | null {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    const item = this.storage.getItem(key);
  
    if (item !== null) {
      try {
        var storeValue = item;
        if(key != StoreKeys.Token && key != StoreKeys.RefreshToken) {
          storeValue = (item !== null && item != "" ? this.crypto.decrypt(item) : null);
        }
        const parsedItem = storeValue ? JSON.parse(storeValue) as T : null;
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
    var storeValue = item;
    if(key != StoreKeys.Token && key != StoreKeys.RefreshToken) {
        storeValue = (item !== null && item != "" ? this.crypto.decrypt(item) : null);
    }
    //console.log("key", key);
    //console.log("decrypt key", storeValue);
    return storeValue;
  }

  removeItem(key: string, useSessionStorage = false): void {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.storage.removeItem(key);
    this.notifySubscribers(key);
  }

  private notifySubscribers(key: string) {
    if (this.storageSubscriptions.has(key)) {
      this.storageSubscriptions.get(key)!.next(this.storage.getItem(key));
    }
  }

  clear(useSessionStorage = false): void {
    this.storage = useSessionStorage ? sessionStorage : localStorage;
    this.storage.clear();
  }
}

export function setItem(key: string, value: any, useSessionStorage = false): void {
  let storage = useSessionStorage ? sessionStorage : localStorage;
  let storeValue = value;
    if(key != StoreKeys.Token && key != StoreKeys.RefreshToken) {
      storeValue = CryptoService.encrypt(value);
    }
    storage.setItem(key, storeValue);
}

export function getItem(key: string, useSessionStorage = false): string | null {
  let storage = useSessionStorage ? sessionStorage : localStorage;
  const item = storage.getItem(key);
  var storeValue = item;
  if(key != StoreKeys.Token && key != StoreKeys.RefreshToken) {
      storeValue = (item !== null && item != "" ? CryptoService.decrypt(item) : null);
  }  
  return storeValue;
}
