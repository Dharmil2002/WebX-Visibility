import { StorageService } from './storage.service';
// data.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavDataService {
  
  constructor(private storage: StorageService) { 
    
  }

  setData(data: any) {
    this.storage.setItem('u8KH4qxm', JSON.stringify(data));
  }

  getData(): any {
    const val = this.storage.getItem('u8KH4qxm');
    if(val)
      return JSON.parse(val);
    return null;
  }

  clear() {
    const val = this.storage.removeItem('u8KH4qxm');
  }
}