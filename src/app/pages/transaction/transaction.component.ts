import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/modules/_services/payment.service';
import { StorageService } from 'src/app/modules/_services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent implements OnInit {
  public donationForm: FormGroup;
  public isLoading: boolean = false;
  public validatePaypal;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private _storageService: StorageService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    const paymentRef = this._storageService.getItem('ref');
    if (paymentRef) {
      this.validateTrasaction({ ref: paymentRef });
      this._storageService.removeItem('ref');
    } else {
      this.route.queryParams.subscribe((params) => {
        if (params.paymentId) {
          this.validatePaymentPaypal(params);
        } else {
          const { id_transaction } = params;
          this.validateTrasaction(id_transaction);
        }
      });
    }
  }

  buildForm() {
    this.donationForm = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required]],
      last_name: [{ value: '', disabled: true }, [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required]],
      phone: [{ value: '', disabled: true }, [Validators.required]],
      country: [{ value: '', disabled: true }, [Validators.required]],
      event: [{ value: '', disabled: true }, [Validators.required]],
      amount: [{ value: '', disabled: true }, [Validators.required]],
      currency: [{ value: '', disabled: true }, [Validators.required]],
      paymentMethod: [{ value: '', disabled: true }, [Validators.required]],
      reference: [{ value: '', disabled: true }, [Validators.required]],
      status: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  get form() {
    return this.donationForm.controls;
  }

  validateTrasaction(id_transaction) {
    this.spinner.show();

    this.paymentService.getTransactionInfo(id_transaction).subscribe(
      (res) => {
        this.spinner.hide();
        const set_values = {
          name: res?.user?.name,
          last_name: res?.user?.last_name,
          email: res?.user?.email,
          phone: res?.user?.phone,
          country: res?.user?.country,
          event: res?.donation?.name,
          amount: res?.transaction.amount,
          currency: res?.transaction.currency,
          paymentMethod: this.validatePaymentMethod(
            //MIRAR SI SE PUEDE MEJORAR
            res?.transaction.payment_gateway.toLowerCase() === 'box' //SE VALIDA SI EL METODO DE PAGO ES CAJA
              ? 'box' //SI ESCAJA SE ASIGNA EL VALOR
              : res?.transaction.payment_method //SI ES DIFERENTE DE CAJA SE ASIGNA EL METODO DE PAGO
          ),
          reference: res?.transaction.payment_ref,
          status: this.validateStatus(res?.transaction.status),
        };
        this.donationForm.patchValue(set_values);
      },
      (err) => {
        this.spinner.hide();
        throw err;
      }
    );
  }

  submit(): void {
    if (this.validatePaypal) {
      this.validatePaymentPaypal(this.validatePaypal);
    } else {
      const { reference } = this.donationForm.getRawValue();
      this.isLoading = true;
      this.spinner.show();
      this.paymentService.getTransactionInfo(reference).subscribe(
        (res) => {
          this.isLoading = false;
          this.donationForm.patchValue({ ...res, ...res.donation });
        },
        (err) => {
          this.spinner.hide();
          throw err;
        }
      );
    }
  }

  validatePaymentPaypal(params) {
    this.validatePaypal = params;
    this.spinner.show();
    this.paymentService.validatePaymentPaypal(params).subscribe(
      (res) => {
        this.spinner.hide();
        this.donationForm.patchValue({ ...res, ...res.donation });
      },
      (err) => {
        this.spinner.hide();
        throw err;
      }
    );
  }

  validateStatus(status) {
    if (parseInt(status) == 1) {
      return 'Aprobado';
    } else if (parseInt(status) == 2) {
      return 'En proceso';
    } else if (parseInt(status) == 3) {
      return 'Cancelado/Declinado';
    }
  }

  validatePaymentMethod(payment_method) {
    console.log(payment_method);
    if (payment_method.toLowerCase() == 'credit') {
      return 'Tarjeta de credito';
    } else if (payment_method.toLowerCase() == 'pse') {
      return 'PSE';
    } else if (payment_method.toLowerCase() == 'cash') {
      return 'Efectivo';
    } else if (payment_method.toLowerCase() == 'administration') {
      return 'Administración';
    } else if (payment_method.toLowerCase() == 'code') {
      return 'Codigo';
    } else if (payment_method.toLowerCase() == 'box') {
      return 'Caja';
    }
  }
}
