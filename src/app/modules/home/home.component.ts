import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { EventsService } from '../_services/events.service';
import { Event } from '../_models/event.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isGrid: boolean = false;
  public events: Event[] = [];
  public categories: string[] = [];
  public categoriesFilter: string[] = [];
  public checkBoxes: MatCheckbox[] = [];
  public isLoading: boolean = false;

  private unsubscribe: Subscription[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, 
    private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getEvents();
    this.getCategories();
  }

  getEvents() {
    // console.log("RE SUAVE MI PAPA", this.activatedRoute.snapshot.queryParamMap.get("visibility"));
    var visibility = [];
    if(this.activatedRoute.snapshot.paramMap.get('visibility') === "all"){ visibility = ['international','bogota']; }
    else{ visibility = ['bogota'] }

    const getEventsSubscr = this.eventsService
      .getFilter({ type: 'G12_EVENT', visibility: JSON.stringify(visibility) }).subscribe((res: Event[]) => {
        res.reverse(); //TO SORT ARRAY
        this.events = res;
      });
    this.unsubscribe.push(getEventsSubscr);
  }

  getCategories() {
    const getCategoriesSubscr = this.eventsService
      .getCategories().subscribe((res: string[]) => {
        this.categories = res;
      });
    this.unsubscribe.push(getCategoriesSubscr);
  }

  pushCategory(checkbox: MatCheckbox, cat: string) {
    if(this.categoriesFilter.length > 0){
      if(!checkbox.checked){  //TO PUSH
        this.categoriesFilter.push(cat);
      }else{ //TO REMOVE
        const index = this.categoriesFilter.indexOf(cat);
        this.categoriesFilter.splice( index, 1);
      }
    }else{
      this.categoriesFilter.push(cat);
    }
    this.checkBoxes.push(checkbox);
  }

  filterEventsByCategories() {
    if(this.categoriesFilter.length > 0){
      this.isLoading = true;
      let visibility = [];
      if(this.activatedRoute.snapshot.paramMap.get('visibility') === "all"){ visibility = ['international','bogota']; }
      else{ visibility = ['bogota'] }

      const getEventsSubscr = this.eventsService
      .getFilterCategories({ category: JSON.stringify(this.categoriesFilter), visibility: JSON.stringify(visibility) }).subscribe((res: Event[]) => {
        this.events = res;
        this.isLoading = false;
      });
    this.unsubscribe.push(getEventsSubscr);
    }
  }

  cleanFilter(){
    this.checkBoxes.forEach((box) => box.checked = false)
    this.categoriesFilter = [];
    this.getEvents();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
