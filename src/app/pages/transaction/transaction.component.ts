import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/modules/_services/payment.service';
import { StorageService } from 'src/app/modules/_services/storage.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public donationForm: FormGroup;
  public isLoading: boolean = false;
  public validatePaypal;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
    private paymentService: PaymentService, private _storageService: StorageService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.buildForm();
    const paymentRef = this._storageService.getItem("ref");
    if (paymentRef) {
      this.validateTrasaction({ ref: paymentRef });
      this._storageService.removeItem("ref")
    } else {
      this.route.queryParams.subscribe((params) => {
        console.log('tenemos el pago', params);
        if (params.paymentId) {
          this.validatePaymentPaypal(params);
        } else {
          const { ref } = params;
          this.validateTrasaction({ ref });
        }

      })
    }
  }

  buildForm() {
    this.donationForm = this.fb.group({
      name: [{ value: '', disabled: true }, [Validators.required]],
      last_name: [{ value: '', disabled: true }, [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required]],
      phone: [{ value: '', disabled: true }, [Validators.required]],
      country: [{ value: '', disabled: true }, [Validators.required]],
      city: [{ value: '', disabled: true }, [Validators.required]],
      event: [{ value: '', disabled: true }, [Validators.required]],
      amount: [{ value: '', disabled: true }, [Validators.required]],
      currency: [{ value: '', disabled: true }, [Validators.required]],
      paymentMethod: [{ value: '', disabled: true }, [Validators.required]],
      reference: [{ value: '', disabled: true }, [Validators.required]],
      status: [{ value: '', disabled: true }, [Validators.required]],
    });
  }

  get form() { return this.donationForm.controls; }

  validateTrasaction(params) {
    this.spinner.show();

    this.paymentService.getTransactionInfo(params.ref)
      .subscribe(res => {
        this.spinner.hide();
        this.donationForm.patchValue({ ...res, ...res.donation });
      }, err => { this.spinner.hide(); throw err; })
  }

  submit(): void {
    if (this.validatePaypal) {
      this.validatePaymentPaypal(this.validatePaypal)
    } else {
      const { reference } = this.donationForm.getRawValue();
      this.isLoading = true;
      this.spinner.show();
      this.paymentService.getTransactionInfo(reference)
        .subscribe(res => {
          this.isLoading = false;
          this.donationForm.patchValue({ ...res, ...res.donation });
        }, err => { this.spinner.hide(); throw err; })
    }

  }

  validatePaymentPaypal(params) {
    this.validatePaypal = params;
    this.spinner.show();
    this.paymentService.validatePaymentPaypal(params).subscribe(res => {
      this.spinner.hide();
      this.donationForm.patchValue({ ...res, ...res.donation });
    }, err => {
      this.spinner.hide(); throw err
    });

  }

}
