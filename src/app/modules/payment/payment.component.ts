import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';



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
  public showNational: boolean;
  public method_selected = 1;
  public assistantsValidate;
  public countrys_language = COUNTRIES;

  constructor(private fb: FormBuilder, private eventsService: EventsService,
    private assistantsService: AssistantsService, private paymentService: PaymentService,
    private storageService: StorageService, private router: Router,
    private cdr: ChangeDetectorRef, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.scrollToTop();
    this.getBanks();
    this.event = this.eventsService.event;
    this.assistantsValidate = this.assistantsService.assistants.length;
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
  scrollToTop() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 500); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
  buildForm() {
    this.donationForm = this.fb.group(NEW_DONATION);
    this.donationForm.get('currency').setValue('COP');
    this.donationForm.controls.currency.disable();
    this.donationForm.get('country').setValue('Colombia');
    this.validateCountry('Colombia');
    console.log('el evento es', this.event.financialCutSelected)
    if (this.event.financialCutSelected.is_group) {
      this.donationForm.get('amount').setValue(this.event.financialCutSelected.price_group.cop);
      this.donationForm.controls.amount.disable();

    } else {
      this.donationForm.get('amount').setValue(this.event.financialCutSelected.prices.cop * this.assistantsService.assistants.length);
      this.donationForm.controls.amount.disable();
    }
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
    console.log('validamos', country)
    if (country == "Colombia") {
      this.showNational = true;
      this.donationForm.get('currency').setValue('COP');
      if (this.event.financialCutSelected.is_group) {
        this.donationForm.get('amount').setValue(this.event.financialCutSelected.price_group.cop);
        this.donationForm.controls.amount.disable();

      } else {
        this.donationForm.get('amount').setValue(this.event.financialCutSelected.prices.cop * this.assistantsService.assistants.length);
        this.donationForm.controls.amount.disable();
      }
      // this.cdr.detectChanges();
      this.donationForm.get('document').setValidators([Validators.required]);
    } else {
      this.showNational = false;
      this.donationForm.get('document').setErrors(null);
      this.donationForm.get('currency').setValue('USD');
      this.method_selected = 1;
      if (this.event.financialCutSelected.prices.usd) {
        if (this.event.financialCutSelected.is_group) {
          this.donationForm.get('amount').setValue(this.event.financialCutSelected.price_group.usd);
          this.donationForm.controls.amount.disable();

        } else {
          this.donationForm.get('amount').setValue(this.event.financialCutSelected.prices.usd * this.assistantsService.assistants.length);
          this.donationForm.controls.amount.disable();
        }
      } else {
        Swal.fire('Error','Este corte no tiene pago en dolares','warning');
        this.donationForm.get('country').setValue('Colombia');
      }
      // this.cdr.detectChanges();
    }
  }

  // recibimos los datos del formulario
  submit() {
    // eliminamos la referencia por si existe en el storage
    this.storageService.removeItem('paymentRef');
    // validamos que el usuario llene bien los campos de informacion personal si nos retorna true pasamos a validar los campos del pago
    const personal_info_validate = this.validateFormErrors();
    // validamos el metodo de pago que vamos a usar
    this.donationForm.get('paymentType').setValue(this.method_selected.toString())
    // si la validacion de errores de inmformacion personal fue satisfactoria procedemos a validar el pago
    if (personal_info_validate) {
      // validamos los errores en los metodos de pago
      const validate_info_pay = this.validatePayInformation(this.method_selected);
      // si la valdiacion de los campos del pago fue correcta procedemos con hacer la peticion al endPoint
      if (validate_info_pay) {
        // ponemos un loader para que no nos ejecuten mas de una accion
        this.isLoading = true;
        // validamos el moetodo de pago y usamos la funcion para cada uno
        if (this.method_selected == 1) {
          // enviamos solicitud a tarjeta de credito
          this.creditCardPayment();
        } else if (this.method_selected == 2) {
          // enviamos solicitud  pse
          this.psePayment();
        } else if (this.method_selected == 3) {
          // enviamos solicitud a payu efectivo
          this.cashPayment();
        } else if (this.method_selected == 4) {
          // enciamos solicitud con codigo de masivo
          this.codePayment()
        } else if (this.method_selected == 5) {
          // enciamos solicitud con codigo de masivo
          this.paypalPayment();
        }
      }
    }

  }

  ////////////////////////////////////////
  // <---------METODOS DE PAGO--------->
  // ////////////////////////////////////
  psePayment() {
    // creamos el objeto que recibira el enpint enviamos todos los datos de la donacion del evento y los asistentes que estan en el servicio
    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);

    console.log('insert payment', data);
    const pseSubscr = this.paymentService.registerUsers(data)
      .subscribe((res) => {
        this.isLoading = false;
        this.storageService.setItem("ref", res.ref);
        this.storageService.setItem('clearAssistans', true);
        this.showPopUp(res);
        if (res.url) { window.open(res.url, '_blank'); }
      }, err => { this.isLoading = false; this.showPopUp(err.error); throw err; })
    this.unsubscribe.push(pseSubscr);
  }

  creditCardPayment() {
    // creamos el objeto que recibira el enpint enviamos todos los datos de la donacion del evento y los asistentes que estan en el servicio
    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);
    const creditSubscr = this.paymentService.registerUsers(data)
      .subscribe((res) => {
        this.isLoading = false;
        this.storageService.setItem('clearAssistans', true);
        this.showPopUp(res);
        // console.log("CARD RESPONSE", res);
      }, err => { this.showPopUp(err.error); this.isLoading = false; throw err; })
    this.unsubscribe.push(creditSubscr);
  }

  // creamos el objeto que recibira el enpint enviamos todos los datos de la donacion del evento y los asistentes que estan en el servicio
  cashPayment() {
    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);
    if (data.payment.amount <= 10000) {
      this.showPopUp({
        message: "El monto mínimo de la transacción debe ser mayor a $10.000",
        status: "FAILED"
      });
      this.isLoading = false;
    } else {
      const cashSubscr = this.paymentService.registerUsers(data)
        .subscribe((res) => {
          this.storageService.setItem('clearAssistans', true);
          this.isLoading = false;
          window.open(res.url, '_blank');
          this.showPopUp(res);
          // console.log("CASH RESPONSE", res);
        }, err => { this.showPopUp(err.error); this.isLoading = false; throw err; })
      this.unsubscribe.push(cashSubscr);
    }

  }
  // creamos el objeto que recibira el enpint enviamos todos los datos de la donacion del evento y los asistentes que estan en el servicio

  codePayment() {
    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);
    const cashSubscr = this.paymentService.redeemCode(data)
      .subscribe((res) => {
        this.storageService.setItem('clearAssistans', true);
        this.isLoading = false;
        this.showPopUp(res);
        // console.log("CASH RESPONSE", res);
      }, err => { this.showPopUp(err.error); this.isLoading = false; throw err; })
    this.unsubscribe.push(cashSubscr);
  }
  // creamos el objeto que recibira el enpint enviamos todos los datos de la donacion del evento y los asistentes que estan en el servicio

  paypalPayment() {
    const data = insertPayment({ ...this.donationForm.getRawValue() },
      this.event, this.assistantsService.assistants);

    console.log('PAGO PAYPAL', data);
    const paypalSubscr = this.paymentService.registerUsers(data)
      .subscribe((res) => {
        this.isLoading = false;
        this.storageService.setItem('clearAssistans', true);
        this.showPopUp(res);
        if (res.url) { window.open(res.url, '_blank'); }
      }, err => { this.isLoading = false; this.showPopUp(err.error); throw err; })
    this.unsubscribe.push(paypalSubscr);
  }

  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  // <---------FIN METODOS DE PAGO--------->
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


  showPopUp(response: any) {
    const dialogRef = this.dialog.open(ResponsePopupComponent, {
    });
    dialogRef.componentInstance.response = response;
    dialogRef.afterClosed().subscribe(result => {
      console.log("MODAL RESULT", response);
      if (response.status == "PENDING" ||
        response.status == "SUCCESS") {
        this.storageService.removeItem("assistants");
        console.log('lo tenemos')
        this.router.navigate(['/home/all']);
      }
    });
  }

  goBack() {
    if (!this.event?.id) {
      this.router.navigate(['/home/all']);
    } else {
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
