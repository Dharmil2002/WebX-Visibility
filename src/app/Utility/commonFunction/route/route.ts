import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root",
  })
export class NavigationService {
  constructor(private router: Router) {}

  // Function to navigate to a specified route URL with data
  navigateTo(routeUrl: string, data: any) {
    this.router.navigate([routeUrl], {
      // Set the state object with the provided data
      state: {
        data: data,
      },
    });
  }

  // End

 // Function to navigate to a specified route URL with data
 navigateTotab(tabIndex: string,path:string): void {
    this.router.navigate([path], { queryParams: { tab: tabIndex } });
  }
 // End

}
