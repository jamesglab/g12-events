import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Event } from 'src/app/modules/_models/event.model';

@Component({
  selector: 'app-events-slider',
  templateUrl: './events-slider.component.html',
  styleUrls: ['./events-slider.component.css']
})
export class EventsSliderComponent implements OnInit, OnChanges {

  @Input() public events: Event[] = null;
  public currentEvent: number = 0;
  public interval: any = null;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  ngOnChanges() {
    if(this.events.length > 0){ //VALIDATE EMPTY ARRAY
      if(this.events.length > 4){ //VALIDATE IF HAVE MORE OF 4 ELEMENT (FOR slider-indicator)
        let newEvents: Event[] = [];
        for(let i =0; i < 4 ; i++){
          newEvents.push(this.events[i]);
        }
        this.events = newEvents; //SET ONLY 4 ELEMENTS
      }
      this.sliderInterval(); //START INTERVAL FOR CHANGE AUTOMATICALLY
    }
  }

  eventDetail(id: number) {
    const _id = btoa(id.toString());
    this.router.navigate(['home/event', _id]); // ENCRIPT ID AND GO TO DETAIL
  }

  sliderInterval(){
    this.interval = setInterval(() => { 
      // VALIDATE IF EXIST NEXT ELEMENT, AND INCREMENT
      //IF NOT EXISTS, SET TO 0
      if(this.events[this.currentEvent + 1]){
        this.currentEvent ++;
      }else{
        this.currentEvent = 0;
      }
    },7000) // 7SEG INTERVAL
  }

  setCurrentEvent(value: number){ 
    //SET CURRENT ELEMENT BY USER AND CLEAR INTERVAL FOR AVOID BUGS
    this.currentEvent = value;
    clearInterval(this.interval);
  }

  ngOnDestroy() {
    if(this.interval){clearInterval(this.interval);} //DESTROY THE COMPONENT, SO CLEAR INTERVAL
  }

}
