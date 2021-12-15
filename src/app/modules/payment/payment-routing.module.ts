import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionComponent } from 'src/app/pages/transaction/transaction.component';
import { PaymentComponent } from './payment.component';

const routes: Routes = [
  { 
    path: '',
    component: PaymentComponent,
  },
  {
    path: 'transaction',
    component: TransactionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
