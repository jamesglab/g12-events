import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentRoutingModule } from './payment-routing.module';

import { PaymentComponent } from './payment.component';
import { ResponsePopupComponent } from './components/response-popup/response-popup.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    PaymentComponent,
    ResponsePopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PaymentRoutingModule
  ]
})
export class PaymentModule { }
