import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'landing',
    loadChildren: () => import('./modules/landing/landing.module').then((m) => m.LandingModule),
        // canActivate: [AuthGuard],
  },
  {
    path: 'payment',
    loadChildren: () => import('./modules/payment/payment.module').then((m) => m.PaymentModule)
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '',
    redirectTo: 'home', //J2415Whr7FrkId41lnnb03AaI7w==,
    pathMatch: "full"
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }