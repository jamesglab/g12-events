// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrlG12Connect: {
    donations: 'https://api.g12connect.com/api/v2/donations',
    managment: 'https://api.g12connect.com/api/v2/managment',
    users: 'https://api.g12connect.com/api/v2/users',
    payments: 'https://api.g12connect.com/api/v2/payments',
    payments_v3: 'https://api.g12connect.com/api/v3/payments',
  },
  urlResponse: 'https://dev.eventosg12.com/payment/transaction',
};
