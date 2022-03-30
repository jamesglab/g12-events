import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';

import { EventCardComponent } from 'src/app/modules/home/components/event-card/event-card.component';
import { EventDetailComponent } from 'src/app/pages/event-detail/event-detail.component';
import { AddAssistantComponent } from 'src/app/pages/event-detail/components/add-assistant/add-assistant.component';
import { AssistantsTableComponent } from 'src/app/pages/event-detail/components/assistants-table/assistants-table.component';
import { TermsConditionsComponent } from 'src/app/pages/event-detail/components/terms-conditions/terms-conditions.component';
import { TranslateModule } from '@ngx-translate/core';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { IvyCarouselModule } from "angular-responsive-carousel";


@NgModule({
  declarations: [
    HomeComponent,
    EventDetailComponent,
    EventCardComponent,
    AddAssistantComponent,
    AssistantsTableComponent,
    TermsConditionsComponent,
    CarrouselComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    TranslateModule,
    IvyCarouselModule
  ]
})
export class HomeModule { }
