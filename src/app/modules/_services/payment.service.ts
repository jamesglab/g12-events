import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  getePaycoBanks(): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.payments_v3}/banks`
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getTransactionInfo(transaction_id: string) {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.payments_v3}/detail-payment`,
        { params: { transaction_id } }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  registerUsers(data: any): Observable<any> {
    console.log('send data', data);
    // if (data?.payment?.currency == 'usd') {
    //   delete data.customer.documentType;
    //   delete data.customer.document;
    //   delete data.payment.doc_type;
    //   delete data.payment.doc_number;
    // }
    return this.http
      .post<any>(
        `${environment.apiUrlG12Connect.payments_v3}/to-events`
        ,
        data,
        { headers: header }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
  redeemCode(data) {
    if (data?.payment?.currency == 'usd') {
      delete data.customer.documentType;
      delete data.customer.document;
      delete data.payment.doc_type;
      delete data.payment.doc_number;
    }
    return this.http
      .post<any>(
        `${environment.apiUrlG12Connect.donations}/redeem-code`,
        JSON.stringify(data),
        { headers: header }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
  validatePaymentPaypal(params) {
    return this.http
      .get<any>(
        `${environment.apiUrlG12Connect.payments}/transaction/validate-paypal`,
        { headers: header, params }
      )
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
}
