import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuAccessService {

  constructor() { }


  hasPermission(id: string, MenuMode, mode: string): boolean {

    const data = MenuMode.find((x) => x.id === id && x.permission.includes(mode));
    if (data) {
      return true;
    }
    else {
      return false
    }

  }
}
