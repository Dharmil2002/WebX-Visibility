/**
 * This file contains authentication parameters. Contents of this file
 * is roughly the same across other MSAL.js libraries. These parameters
 * are used to initialize Angular and MSAL Angular configurations in
 * in app.module.ts file.
 */

import {
  BrowserCacheLocation,
  Configuration,
  LogLevel,
} from '@azure/msal-browser';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_SignIn_Policy',
    editProfile: 'B2C_1_ProfileEditPolicy',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://mywebxpress.b2clogin.com/mywebxpress.com/B2C_1_SignIn_Policy',
    },
    editProfile: {
      authority:
        'https://mywebxpress.b2clogin.com/mywebxpress.com/B2C_1_ProfileEditPolicy',
    },
  },
  authorityDomain: 'mywebxpress.b2clogin.com',
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
   http://localhost:4200/ :  66240187-fdee-4fdd-8612-c4bea87ddbf9
   https://webx-ims.azurewebsites.net/ : 86fd4ad5-b8cd-4793-906c-a14d4cd09ea6
*/
export const msalConfig: Configuration = {
  auth: {
    //5d68a407-c4de-4a2a-9c9d-3f9a73886219
    clientId: '66240187-fdee-4fdd-8612-c4bea87ddbf9', // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Defaults to "https://login.microsoftonline.com/common"
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: '', // Points to window.location.origin. You must register this URI on Azure portal/App Registration.
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: isIE, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        // console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  todoListApi: {
    endpoint: 'https://localhost:44351/api/todolist',
    scopes: [
      'https://mywebxpress.com/d97348f3-487c-4e3a-ae39-acb0a063bac1/tasks.read',
    ],
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [],
};
