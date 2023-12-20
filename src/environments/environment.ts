// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  AuthAPIGetway: "http://localhost:3000/v1/auth/",
  localNumberFormat: "en-IN",
  APIBaseURL:"http://localhost:3000/v1/",  
  APIBaseBetaURL:"https://cnoteentry.azurewebsites.net/api/"

  // AuthAPIGetway: "https://tms-api.beta.mywebxpress.com/v1/auth/",
  // localNumberFormat: "en-IN",
  // APIBaseURL: "https://tms-api.beta.mywebxpress.com/v1/",
  // APIBaseBetaURL: "https://cnoteentry.azurewebsites.net/api/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
