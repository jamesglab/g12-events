import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { EventsService } from '../_services/events.service';
import { Event } from '../_models/event.model';
import { environment } from 'src/environments/environment';

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
  public innerWidth
  public isResponsive
  public images = [];
  private unsubscribe: Subscription[] = [];

  constructor(private router: Router,
    private eventsService: EventsService, private cdr: ChangeDetectorRef) { }
  @HostListener('window:resize', ['$event'])

  onResize(event?) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 800) {
      this.isResponsive = true;
      this.cdr.detectChanges();
    } else {
      this.isResponsive = false;
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.getEvents();
    this.getCategories();
    this.onResize();
  }

  getEvents() {

    const route = this.router.url.split("/")[2];
    var visibility = [];

    if (route === "all") { visibility = ['international', 'bogota']; }
    else { visibility = ['bogota'] }
    const getEventsSubscr = this.eventsService
      .getEvent({}).subscribe((res: Event[]) => {
        this.events = res;
        for (const event of res) {
          if(event.image_banner) {
            this.images.push({
              image: event.image_banner,
              url: `${environment.urlDetailEvent}/${btoa(event.id.toString())}`
            })
          }
        }
        console.log(this.images)
        // this.events.map((event, i) => {
        //   if (event.id == 29) {
        //     this.events.splice(i, 1)
        //   }
        // })
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
    if (this.categoriesFilter.length > 0) {
      if (!checkbox.checked) {  //TO PUSH
        this.categoriesFilter.push(cat);
      } else { //TO REMOVE
        const index = this.categoriesFilter.indexOf(cat);
        this.categoriesFilter.splice(index, 1);
      }
    } else {
      this.categoriesFilter.push(cat);
    }
    this.checkBoxes.push(checkbox);
  }

  filterEventsByCategories() {
    if (this.categoriesFilter.length > 0) {
      this.isLoading = true;
      const route = this.router.url.split("/")[2];
      let visibility = [];

      if (route === "all") { visibility = ['international', 'bogota']; }
      else { visibility = ['bogota'] }

      const getEventsSubscr = this.eventsService
        .getFilterCategories({
          type: 'G12_EVENT', category: JSON.stringify(this.categoriesFilter),
          visibility: JSON.stringify(visibility)
        }).subscribe((res: Event[]) => {
          this.events = res;
          this.isLoading = false;
        });
      this.unsubscribe.push(getEventsSubscr);
    }
  }

  cleanFilter() {
    this.checkBoxes.forEach((box) => box.checked = false)
    this.categoriesFilter = [];
    this.getEvents();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
