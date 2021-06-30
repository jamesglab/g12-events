import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { EventDetailComponent } from 'src/app/pages/event-detail/event-detail.component';

const routes: Routes = [
  { 
    path: 'all',
    component: HomeComponent,
  },
  {
    path: 'bogota',
    component: HomeComponent
  },
  {
    path: 'event/:id',
    component: EventDetailComponent
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
