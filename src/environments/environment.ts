// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrlConexion12: "http://51.79.78.171:7003/",
  // apiUrlDonations: "http://51.79.78.171:3002/",
  apiUrlG12Connect: {
    donations: 'https://dev-api.g12connect.com/api/v2/donations',
    managment: 'https://dev-api.g12connect.com/api/v2/managment',
    users: 'https://dev-api.g12connect.com/api/v2/users',
    payments: 'https://dev-api.g12connect.com/api/v2/payments'
  },
  urlResponse: "https://development.d3gdrq5zztbv0t.amplifyapp.com/payment/transaction"
  // Initialize Firebase
  // firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
