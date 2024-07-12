import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var gtag: Function;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {
  constructor(private router: Router) {}

  public initialize() {
    this.onRouteChange();

    // dynamically add analytics scripts to document head
    try {
      const url = 'https://www.googletagmanager.com/gtag/js?id=';
      const gTagScript = document.createElement('script');      
      gTagScript.async = true;
      gTagScript.src = `${url}${environment.gAnalyticsId}`;
      document.head.appendChild(gTagScript);

      const dataLayerScript = document.createElement('script');
      dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${environment.gAnalyticsId}');`;
      document.head.appendChild(dataLayerScript);
    } catch (e) {
      console.error('Error adding Google Analytics', e);
    }
  }

  // track visited routes
  private onRouteChange() {    
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.gAnalyticsId, {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }

  // use gtag.js to send Google Analytics Events
  public event(eventName: string, eventCategory?: string, eventLabel?: string, value?: string, tenantId?: number) {
    gtag('event', eventName, {
      ...(eventCategory && { event_category: eventCategory }),
      ...(eventLabel && { event_label: eventLabel }),
      ...(value && { value: value }),
      ...(tenantId && { tenant_id: tenantId })
    });
  }
}