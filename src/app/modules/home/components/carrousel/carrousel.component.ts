import { Component, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.css']
})
export class CarrouselComponent implements OnInit {

  @Input() public images = []

  constructor() { }

  ngOnInit(): void {
  }

}
