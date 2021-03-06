import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { filter } from 'rxjs/operators';
// import { map, catchError } from 'rxjs/operators';

// import { header } from 'src/app/_helpers/tools/header.tool';
// import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/modules/_services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AssistantsService {
  @Output() assistantsEvent: EventEmitter<any[]> = new EventEmitter();
  public assistants: any[] = [];
  public previousUrl: string = '';
  public financialCutSelected: any;

  constructor(private storage: StorageService, private router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const validateClearAssistans = this.storage.getItem('clearAssistans');
        if (validateClearAssistans) {
          this.storage.removeItem('clearAssistans');
          this.storage.removeItem('assistants');
          this.assistants = [];
          this.financialCutSelected = null;
        } else {
          if (this.previousUrl === '/payment') {
            const assistants = this.storage.getItem('assistants');
            this.financialCutSelected = this.storage.getItem(
              'financialCutSelected'
            );
            if (assistants) {
              this.assistants = assistants;
            }
          }
        }
        //VALIDAMOS SI EL USUARIO SE DIRECCIONO A EL HOME DE EVENTOS
        if (event.url == '/home/all') {
          //LIMPIAMOS LAS VARIABLES DE ACCESO
          this.storage.clear();
          this.assistants = [];
          this.financialCutSelected = null;
        }
        this.previousUrl = event.url;
      });
  }

  addNewAssistant(assistant: { [key: string]: string }) {
    this.assistants.push(assistant);
    this.assistantsEvent.emit(this.assistants);
  }

  deleteItem(index: number) {
    this.assistants.splice(index, 1);
    this.assistantsEvent.emit(this.assistants);
    this.saveAssistantOnStorage();
  }

  saveAssistantOnStorage() {
    this.storage.setItem('assistants', this.assistants);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      throw error.error.message;
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(error);
  }
}
