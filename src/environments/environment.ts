// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:4200",
  APIGetway:
    "https://velocity-services-vendorportal-beta.azurewebsites.net/api/VendorPortal/VendorDashboard/",
  AuthAPIGetway: "https://greenxpress-beta-api.azurewebsites.net/api/Auth/",
  MasterAPIGetway: "https://greenxpress-beta-api.azurewebsites.net/api/Master/",
  SignalRAPIGetway: "https://greenxpress-beta-api.azurewebsites.net/api/",
  TripApiGetway: "https://greenxpress-beta-api.azurewebsites.net/api/",
  DashboardAPIGetway:
    "https://greenxpress-beta-api.azurewebsites.net/api/Dashboard/",
  localHost: " http://localhost:7233/api/DMS/",
  localNumberFormat: "en-IN",
  APIBaseURL:"http://localhost:3000/api/",
  APIBaseNewURL:"http://localhost:3000/v1/",
  APIBaseBetaURL:"https://cnoteentry.azurewebsites.net/api/",
  APIMongoUrl:"http://localhost:5000/v1/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
