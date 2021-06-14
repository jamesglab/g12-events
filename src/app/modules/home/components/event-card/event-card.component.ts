import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {

  @Input() isGrid: boolean = null;
  @Input() event: any = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  eventDetail(id: number) {
    const _id = btoa(id.toString());
    this.router.navigate(['home/event', _id]); // ENCRIPT ID AND GO TO DETAIL
  }
  
}
