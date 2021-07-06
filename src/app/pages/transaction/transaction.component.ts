import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/modules/_services/payment.service';
import { StorageService } from 'src/app/modules/_services/storage.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public donationForm: FormGroup;
  public isLoading: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder,
    private paymentService: PaymentService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.buildForm();
    const paymentRef = this._storageService.getItem("ref");
    if(paymentRef){
      this.validateTrasaction({ ref: paymentRef });
    }else{
      this.route.queryParams.subscribe((params) => {
        const { ref } = params;
        this.validateTrasaction({ ref });
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
    this.paymentService.getTransactionInfo(params.ref)
      .subscribe(res => {
        this.donationForm.patchValue({ ...res, ...res.donation });
      }, err => { throw err; })
  }

  submit(): void {
    const { reference } = this.donationForm.getRawValue();
    this.isLoading = true;
    this.paymentService.getTransactionInfo(reference)
      .subscribe(res => {
        this.isLoading = false;
        this.donationForm.patchValue({ ...res, ...res.donation });
      }, err => { throw err; })
  }

}
