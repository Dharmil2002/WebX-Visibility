import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  getCurrentLocation(): Observable<{ latitude: number, longitude: number }> {
    return new Observable((observer) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          observer.complete();
        },
        (error) => observer.error(error)
      );
    });
  }
  
  async getLocation() {
    const location=await this.getCurrentLocation().toPromise();
    return location;
  }
}
