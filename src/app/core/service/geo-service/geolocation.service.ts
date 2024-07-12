import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor(private http: HttpClient) { }

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
    const location = await firstValueFrom(this.getCurrentLocation());
    return location;
  }
  async getIpAddress() {
    const apiUrl = 'https://jsonip.com';
    try {
      const response = await firstValueFrom(this.http.get<any>(apiUrl));
      return response.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  }
  getBrowserInfo(): { name: string, version: string } {
    const userAgent = navigator.userAgent;
    let browserName;
    let browserVersion;

    // Detect Chrome
    if (userAgent.indexOf("Chrome") != -1) {
      browserName = "Chrome";
      browserVersion = userAgent.substring(userAgent.indexOf("Chrome") + 7);
    }
    // Detect Firefox
    else if (userAgent.indexOf("Firefox") != -1) {
      browserName = "Firefox";
      browserVersion = userAgent.substring(userAgent.indexOf("Firefox") + 8);
    }
    // Detect Edge
    else if (userAgent.indexOf("Edg") != -1) {
      browserName = "Edge";
      browserVersion = userAgent.substring(userAgent.indexOf("Edg") + 5);
    }
    // Detect Safari
    else if (userAgent.indexOf("Safari") != -1) {
      browserName = "Safari";
      browserVersion = userAgent.substring(userAgent.indexOf("Version") + 8);
    }
    // Detect Opera
    else if (userAgent.indexOf("OPR") != -1) {
      browserName = "Opera";
      browserVersion = userAgent.substring(userAgent.indexOf("OPR") + 4);
    }
    // Default to unknown
    else {
      browserName = "Unknown";
      browserVersion = "Unknown";
    }

    return { name: browserName, version: browserVersion.split(" ")[0] };
  }
}
