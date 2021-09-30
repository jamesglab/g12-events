import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { header } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }
// creamos los tipos de iglesia 
  getChurchTypes(): Observable<any> {
    return new Observable((obs) => { obs.next({"result":true,"entity":[{"idDetailMaster":88,"idCountry":240,"idMaster":14,"code":"MCI","description":"Iglesia MCI","disposable":true},{"idDetailMaster":89,"idCountry":240,"idMaster":14,"code":"G12","description":"Iglesia G12","disposable":true},{"idDetailMaster":90,"idCountry":240,"idMaster":14,"code":"OT","description":"Otra Iglesia","disposable":true}],"message":["Consulta exitosa."],"notificationType":1}) })
  }

  getCities() {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect.users}/church/city`, { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getPlaces(filter: any): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect.users}/church/filter`, { headers: header, params: filter }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError)
      );
  }

  getLeadersOrPastors(data: { Code: string, IdSede: number }): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrlG12Connect.users}/pastor`, {
      headers: header, params: {
        userCode: data.Code, church: data.IdSede.toString()
      }
    }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      throw error.error.message;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(error);
  }

}
