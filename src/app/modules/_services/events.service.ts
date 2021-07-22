import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { header, handleError } from 'src/app/_helpers/tools/header.tool';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/modules/_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  @Output() eventChange: EventEmitter<any[]> = new EventEmitter();
  public event: any = null;

  constructor(private http: HttpClient, private storage: StorageService) {
    const event = JSON.parse(localStorage.getItem("event"));
    if (event) { this.event = event };
  }

  getAll(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlG12Connect}donations/donations`,
      { headers: header }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getFilter(payload: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlG12Connect}donations/donations/filter`,
      { headers: header, params: payload }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getFilterCategories(filter): Observable<any> {
    // console.log("FILTER", filter)
    return this.http.get<any>(`${environment.apiUrlG12Connect}donations/donations/filter-category`,
      { headers: header, params: filter }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlG12Connect}managment/data-dictionary/filter`,
      { headers: header, params: { type: 'G12_EVENT' } }).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(handleError)
      );
  }
  setEvent(event: any) {
    localStorage.setItem("event", JSON.stringify(event));
    this.event = event;
  }

  validateCapacity(params): Observable<any> {
    // return this.http.get<any>(`${environment.apiUrlG12Connect}donations/donations/validate-availability`,
    //   { headers: header, params }).pipe(
    //     map((res: any) => {
    //       return res;
    //     }),
    //     catchError(handleError)
    //   );
    return new Observable((obse) => obse.next({ status: true }));
  }

  // getEventById(eventId: string){
  //   return this.http.get<any>(
  //     `${(environment.production) ? environment.apiUrlConexion12 : 
  //       environment.apiUrlConexion12.replace("2","3") }Event/Get/${eventId.slice(5)}==`, { headers: header }).pipe(
  //       map((res: any) => {
  //         return res;
  //       }),
  //       catchError(this.handleError),
  //     );
  // }

  // insertFirebaseTransaction(data: any){
  //   return this.transactionsList.push(data);
  // }

}
