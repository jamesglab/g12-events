import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

//COMPONENTS
import { NavbarComponent } from 'src/app/pages/shared-components/navbar/navbar.component';
import { FeaturesComponent } from 'src/app/pages/shared-components/features/features.component';
import { SubscriptionComponent } from 'src/app/pages/shared-components/subscription/subscription.component';
import { FooterComponent } from 'src/app/pages/shared-components/footer/footer.component';



@NgModule({
  declarations: [NavbarComponent,FeaturesComponent,SubscriptionComponent,FooterComponent],
  imports: [
    CommonModule,
    //MATERIAL
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  exports:[
    NavbarComponent,
    FeaturesComponent,
    FooterComponent,
    SubscriptionComponent,
    //MATERIAL
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  providers:[
    MatIconRegistry,
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ]
})
export class SharedModule { }
