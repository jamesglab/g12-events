import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, ValidationErrors } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { numberOnly, validateCardFlag } from 'src/app/_helpers/tools/validator.tool';
import { MONTHS_CREDIT_CARD, YEARS_CREDIT_CARD } from 'src/app/_helpers/tools/fakedb.tool';
import { NEW_DONATION, donation_errors } from 'src/app/_helpers/objects/forms.objects';
import { insertPayment } from 'src/app/_helpers/tools/toInsert.tool';
import { COUNTRIES, ENGLISH_COUNTRIES } from 'src/app/_helpers/tools/countrys.tools'
import { EventsService } from 'src/app/modules/_services/events.service';
import { AssistantsService } from 'src/app/modules/_services/assistants.service';
import { PaymentService } from 'src/app/modules/_services/payment.service';
import { StorageService } from 'src/app/modules/_services/storage.service';

import { ResponsePopupComponent } from './components/response-popup/response-popup.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public event: any = null; //IN CASE OF RETURN - REMEMBER CALL SERVICE
  public donationForm: FormGroup;
  public documentTypes: any[] = [];
  public banks: any[] = [];
  public monthsCreditCard: any[] = MONTHS_CREDIT_CARD;
  public yearsCreditCard: any[] = YEARS_CREDIT_CARD;
  public urlCard: string = "/assets/credit-card/credit-card.svg";
  public isLoading: boolean = false;
  private unsubscribe: Subscription[] = [];

  public method_selected = 1;
  public countrys_language = COUNTRIES;

  constructor(private fb: FormBuilder, private eventsService: EventsService,
    private assistantsService: AssistantsService, private paymentService: PaymentService,
    private storageService: StorageService, private router: Router,
    private cdr: ChangeDetectorRef, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.event = this.eventsService.event;
    if (!this.event || this.assistantsService.assistants.length < 1) {
      this.goBack();
    }
    this.buildForm();
    this.form.cardNumber.valueChanges
      .subscribe(value => {
        const cardFrag = this.getFlagCard(value);
        if (cardFrag != null) { this.urlCard = "/assets/credit-card/" + cardFrag + ".svg"; } else { this.urlCard = "/assets/credit-card/error-card.svg"; }
      });
  }

  buildForm() {
    this.donationForm = this.fb.group(NEW_DONATION);
    this.donationForm.get('currency').setValue('COP');
    this.donationForm.controls.currency.disable();
    this.donationForm.get('country').setValue('Colombia');
    this.donationForm.get('amount').setValue(this.event.financialCut[this.event.financialCutSelected].prices.cop);
    this.donationForm.controls.amount.disable();
    this.form.paymentType.setValue("CAR");
    this.donationForm.get("country").valueChanges.subscribe(country => {
      this.validateCountry(country)
    })
  }

  get form() { return this.donationForm.controls; }

  numberOnly($event) {
    return numberOnly($event);
  }

  getFlagCard(number: string): string {
    return validateCardFlag(number);
  }

  onError(event) {
    event.target.src = '/assets/credit-card/credit-card.svg';
  }

  getBanks() {
    if (this.banks.length == 0) {
      const banksSubscr = this.paymentService
        .getePaycoBanks().subscribe((res: any) => {
          this.banks = res || [];
          this.cdr.detectChanges();
        })
      this.unsubscribe.push(banksSubscr);
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log("TAB CHANGE EVENT", tabChangeEvent);
    this.form.paymentType.setValue(tabChangeEvent.tab.textLabel);
  }

  validateCountry(country) {
    if (country == "Colombia") {
      this.donationForm.get('currency').setValue('COP');
      this.donationForm.get('amount').setValue(this.event.financialCut[this.event.financialCutSelected].prices.cop);
    } else {
      this.donationForm.get('currency').setValue('USD');
      if (this.event.financialCut[this.event.financialCutSelected].prices.usd) {
        this.donationForm.get('amount').setValue(this.event.financialCut[this.event.financialCutSelected].prices.usd);
      } else {
        this.donationForm.get('country').setValue('Colombia')
      }

    }
  }
  submit() {

    this.storageService.removeItem('paymentRef');
    const personal_info_validate = this.validateFormErrors();
    this.donationForm.get('paymentType').setValue(this.method_selected.toString())
    if (personal_info_validate) {

      const validate_info_pay = this.validatePayInformation(this.method_selected);
      if (validate_info_pay) {

        //      this.isLoading = true
        //         this.form.amount.setValue(this.event.prices.cop * this.assistantsService.assistants.length);

        // const data = {
        // customer: insertPayment(this.donationForm.getRawValue()),
        //   usersList: this.assistantsService.assistants
        // };

        //PRIMERO DEBO DE HACER EL PAGO CON LOS ENDPOINT DE DONACIONES
        //LUEGO SI ES SATISFACTORIO,REGISTRAR A LOS USUARIOS
        this.isLoading = true;
        if (this.method_selected == 1) {
          this.creditCardPayment();
        } else if (this.method_selected == 1) {
          this.psePayment();
        } else {
          this.cashPayment();
        }

        // const paymentSubscr = this.eventsService
        //   .proccessPayment(data).subscribe((res: any) => {
        //     this.isLoading = false;
        //     if(res.state != "Error" && !res.MessageError){
        //       this.handleResponse(data, res);
        //     }else{
        //       //ERROR, ERROR
        //       this.showPopUp({ state: 'FAILED', message: (res.MessageError) ? res.MessageError : null })
        //     }
        //   }, err => { throw err; })
        // this.unsubscribe.push(paymentSubscr);
      }
    }

  }

  psePayment() {

    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);
    const pseSubscr = this.paymentService.registerUsers(data)
      .subscribe((res) => {
        this.isLoading = false;
        if (res.url) { window.open(res.url, '_blank'); }
        this.storageService.setItem("paymentRef", res.paymentRef);
        this.showPopUp(res);
      }, err => { this.isLoading = false; this.showPopUp(err.error); throw err; })
    this.unsubscribe.push(pseSubscr);
  }

  creditCardPayment() {
    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);
    const creditSubscr = this.paymentService.registerUsers(data)
      .subscribe((res) => {
        this.isLoading = false;
        this.showPopUp(res);
        // console.log("CARD RESPONSE", res);
      }, err => { this.showPopUp(err.error); this.isLoading = false; throw err; })
    this.unsubscribe.push(creditSubscr);
  }

  cashPayment() {
    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);
    const cashSubscr = this.paymentService.registerUsers(data)
      .subscribe((res) => {
        this.isLoading = false;
        window.open(res.url, '_blank');
        this.showPopUp(res);
        // console.log("CASH RESPONSE", res);
      }, err => { this.showPopUp(err.error); this.isLoading = false; throw err; })
    this.unsubscribe.push(cashSubscr);
  }

  // registerUsers(response: any) {
  //   this.paymentService.registerUsers({
  //     usersList: this.assistantsService.assistants,
  //     donation: this.event.id,
  //     transaction: response.ref
  //   })
  //     .subscribe((res) => {
  //       // console.log("REGISTERED USERS", res);
  //       this.router.navigate(['/home']);
  //     }, err => { throw err; })
  // }

  showPopUp(response: any) {
    //cdkFocusInitial 
    const dialogRef = this.dialog.open(ResponsePopupComponent, {
    });
    dialogRef.componentInstance.response = response;
    dialogRef.afterClosed().subscribe(result => {
      console.log("MODAL RESULT", result);
      if (result.status != "FAILED") {
        this.router.navigate(['/home/all']);
      }
    });
  }

  goBack() {
    if(!this.event?.id){
      this.router.navigate(['/home/all']);
    }else{
      this.router.navigate(['/home/event', btoa(this.event.id)]);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  validateFormErrors() {
    let errorText = '';
    Object.keys(this.donationForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.donationForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {

          if (donation_errors.personal_information[key]) {
            donation_errors.personal_information[key].map(res => { if (res.type == keyError) errorText = `${errorText} <br>- ${res.message}`; })
          }
        });
      }
    });
    if (errorText != '') {
      setTimeout(() => {
        Swal.fire('Verifique los siguientes datos:', errorText, 'error');
      }, 500);
      return false
    } else {
      return true;
    }

  }

  validatePayInformation(pay_info) {

    let errorText = '';
    Object.keys(this.donationForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.donationForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (donation_errors[pay_info][key]) {
            donation_errors[pay_info][key].map(res => { if (res.type == keyError) errorText = `${errorText} <br>- ${res.message}`; })
          }
        });
      }
    });
    if (errorText != '') {
      setTimeout(() => {
        Swal.fire('Verifique los siguientes datos:', errorText, 'error');
      }, 500);
      return false
    } else {
      return true;
    }

  }

}
