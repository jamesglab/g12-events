import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  getePaycoBanks(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect}payments/transaction/epayco/banks`).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  proccessPaymentPSE(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlG12Connect}payments/transaction/epayco/pse`,
      payload).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getTransactionInfo(ref: string) {
    return this.http.get<any>(`${environment.apiUrlG12Connect}payments/transaction/validate-ref`,
      { params: { ref } })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  proccessPaymentCard(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlG12Connect}payments/transaction/epayco/credit`,
      payload).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  proccessPaymentCash(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlG12Connect}payments/transaction/payu`, payload)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  registerUsers(data: any): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrlG12Connect}donations/donations/register-users`,
      JSON.stringify(data), { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError),
      );
  }

}
