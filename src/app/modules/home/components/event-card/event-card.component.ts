import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { EventsService } from '../../../_services/events.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input() isGrid: boolean = null;
  @Input() event: any = null;
  private validateSendMethod = false;

  constructor(private router: Router, private _eventsService: EventsService) { }

  ngOnInit(): void {
  }

  eventDetail(id: number) {
    if (!this.validateSendMethod) {
      this.validateSendMethod = true;
      this._eventsService.validateCapacity({ financial_cut: this.event?.financialCut[0].id, users: 1 }).subscribe(res => {
        if (res.status) {
          this.validateSendMethod = false;
          const _id = btoa(id.toString());
          this.router.navigate(['home/event', _id]); // ENCRIPT ID AND GO TO DETAIL
        } else {
          Swal.fire('Este evento ya no tiene disponibilidad', 'lo sentimos los cupos para este evento ya fueron comprados', 'error')
        }
      },err=>{
        this.validateSendMethod = false;
      });
    }
  }

  handleErrorImage($event: any) {
    $event.target.src = "/assets/cover.png";
  }

}
