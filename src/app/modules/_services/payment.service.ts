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
      `${environment.apiUrlG12Connect.payments}/transaction/epayco/banks`).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getTransactionInfo(ref: string) {
    return this.http.get<any>(`${environment.apiUrlG12Connect.payments}transaction/validate-ref`,
      { params: { ref } })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  registerUsers(data: any): Observable<any> {

    // eliminamos datos que no necesitamos cuando el pago sea internacional
    // limpiamos el storage de los asistentes
    if (data?.payment?.currency == 'usd'){
      delete data.customer.documentType;
      delete data.customer.document;
      delete data.payment.doc_type;
      delete data.payment.doc_number;
    }
      return this.http.post<any>(
        `${environment.apiUrlG12Connect.donations}/register-users`,
        JSON.stringify(data), { headers: header }).pipe(
          map((res: any) => {
            return res;
          }),
          catchError(handleError),
        );
  }

}
