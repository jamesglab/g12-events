import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  public innerWidth: number = 0;
  public isResponsive: boolean = false;

  constructor() { }

  @HostListener('window:resize', ['$event'])

  onResize(event?) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 800) {
      this.isResponsive = true;
    } else {
      this.isResponsive = false;
    }
  }
  ngOnInit(): void {
    this.onResize();
  }

}
