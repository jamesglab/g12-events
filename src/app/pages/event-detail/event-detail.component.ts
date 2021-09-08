import { Component, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddAssistantComponent } from './components/add-assistant/add-assistant.component';

import { EventsService } from 'src/app/modules/_services/events.service';
import { AssistantsService } from 'src/app/modules/_services/assistants.service';
import Swal from 'sweetalert2';
import { StorageService } from 'src/app/modules/_services/storage.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  public event: any = null;
  public date: Date = new Date();
  public search: string = "";
  public assistants: any[] = [];
  public financialCutSelected = 0;
  private unsubscribe: Subscription[] = [];
  private validateSendMethod = false;
  public innerWidth: number = 0;
  public isResponsive: boolean;
  photo = '/assets/cover.png';
  user = 'https://i.pinimg.com/280x280_RS/64/15/94/6415948d5a1366183e7a8c32131acb47.jpg';

  constructor(public dialog: MatDialog, private assistantsService: AssistantsService,
    private eventsService: EventsService, private route: ActivatedRoute, private storageService: StorageService,
    private router: Router, private cdr: ChangeDetectorRef) { }
  @HostListener('window:resize', ['$event'])

  onResize(event?) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 500) {
      this.isResponsive = true;
      // var keybe = document.getElementById('keybe-webchat');
      // if (keybe) {
      //   keybe.remove();
      // }
    } else {
      this.isResponsive = false;
    }
  }

  ngOnInit(): void {
    // getEventById   

    var keybe = document.getElementById('keybe-webchat');
    if (keybe) {
      keybe.remove();
    }
    this.onResize();
    this.getEventById();
    this.assistants = this.assistantsService.assistants;
    this.financialCutSelected = this.assistantsService.financialCutSelected;
    this.susbcribeToChanges();

  }

  getEventById() {
    // localStorage.clear();
    const eventId = atob(this.route.snapshot.paramMap.get("id"));
    const getEventSubscr = this.eventsService
      .getFilter({ id: parseInt(eventId) }).subscribe((res: Event) => {
        // console.log("RESS", res[0]);
        this.event = res[0];
      });
    this.unsubscribe.push(getEventSubscr);
    // if (eventId != "2") {
    //   const getCivilSubscr = this.eventsService
    //     .getEventById(eventId).subscribe((res: any) => {
    //       res.entity[0].eventIdEncrypted = eventId;
    //       this.event = res.entity[0];
    //       this.cdr.detectChanges();
    //     });
    //   this.unsubscribe.push(getCivilSubscr);
    // }
  }

  onSearch(value: string) {
    this.search = value;
  }

  handleAdd() {
    //cdkFocusInitial 
    // console.log('event', this.event)
    if (this.assistants.length < this.event.financialCut[this.financialCutSelected].quantity_register_max) {
      const dialogRef = this.dialog.open(AddAssistantComponent);
      dialogRef.componentInstance.event = this.event;
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // result.Leader = (result.Leader) ? result.Leader.code : null;
          this.assistantsService.addNewAssistant(result);
          this.cdr.detectChanges();
        }
      });
    } else {
      Swal.fire("Completaste el máximo de registros para este ticket",
        `El maximo de registros para este ticket es de  ${this.event.financialCut[this.financialCutSelected].quantity_register_max}`, 'info')
    }

  }

  susbcribeToChanges() {
    this.assistantsService.assistantsEvent.subscribe(assistants => this.assistants = assistants)
  }

  setDataOnStorage() {

    if (this.assistants.length >= this.event.financialCut[this.financialCutSelected].quantity_register_min) {
      if (!this.validateSendMethod) {
        this.validateSendMethod = true;
        this.eventsService.validateCapacity({ financial_cut: this.event.financialCut[this.financialCutSelected].id, users: this.assistants.length }).subscribe(res => {
          if (res.status) {
            this.validateSendMethod = false;
            this.event.assistants = this.assistants.length;
            this.event.financialCutSelected = this.financialCutSelected;
            this.eventsService.setEvent(this.event);
            this.assistantsService.saveAssistantOnStorage();
            this.router.navigate(['/payment']);
          } else {
            Swal.fire('Este evento ya no tiene disponibilidad', 'lo sentimos los cupos para este evento ya fueron comprados', 'error');
          }
        }, err => {
          this.validateSendMethod = false;
        });
      }
    } else {
      Swal.fire('No has completado el minimo de registros para este ticket',
        `El minimo de registros para este ticket es de  ${this.event.financialCut[this.financialCutSelected].quantity_register_max}`, 'info')
    }

  }

  changueFinancialCut(i) {
    if (this.financialCutSelected != i && this.assistants.length > 0) {
      Swal.fire({
        title: 'Cambiar de ticket',
        text: "Al cambiar de ticket se eliminaran los registros actuales",
        showDenyButton: true,
        confirmButtonText: 'Cambiar',
        icon: 'question',
        reverseButtons: true,
        denyButtonText: `Cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.assistants = [];
          this.assistantsService.assistants = [];
          this.financialCutSelected = i;
          this.storageService.setItem('financialCutSelected',i);
        } else if (result.isDenied) {

        }
      })
    } else if (this.assistants.length == 0) {
      this.financialCutSelected = i;
      this.storageService.setItem('financialCutSelected',i);
    }

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  handleErrorImage($event: any) {
    $event.target.src = "/assets/cover.png";
  }

}

