import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddAssistantComponent } from './components/add-assistant/add-assistant.component';

import { EventsService } from 'src/app/modules/_services/events.service';
import { AssistantsService } from 'src/app/modules/_services/assistants.service';

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
  
  photo = '/assets/cover.png';
  user = 'https://i.pinimg.com/280x280_RS/64/15/94/6415948d5a1366183e7a8c32131acb47.jpg'

  constructor(public dialog: MatDialog, private assistantsService: AssistantsService,
    private eventsService: EventsService, private route: ActivatedRoute,
    private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // getEventById
    
    this.getEventById();
    this.assistants = this.assistantsService.assistants;
    this.susbcribeToChanges();
  }

  getEventById() {
   // localStorage.clear();
    const eventId = atob(this.route.snapshot.paramMap.get("id"));
    const getEventSubscr = this.eventsService
    .getFilter({ id: parseInt(eventId) }).subscribe((res: Event) => {
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
    const dialogRef = this.dialog.open(AddAssistantComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result.Leader = (result.Leader) ? result.Leader.code : null;
        this.assistantsService.addNewAssistant(result);
        this.cdr.detectChanges();
      }
    });
  }

  susbcribeToChanges() {
    this.assistantsService.assistantsEvent.subscribe(assistants => this.assistants = assistants)
  }

  setDataOnStorage() {
    this.event.assistants = this.assistants.length;
    this.event.financialCutSelected = this.financialCutSelected;
    this.eventsService.setEvent(this.event);
    this.assistantsService.saveAssistantOnStorage();
    this.router.navigate(['/payment']);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  handleErrorImage($event: any) {
    $event.target.src = "/assets/cover.png";
  }

}
