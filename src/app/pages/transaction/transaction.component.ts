import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/modules/_services/events.service';
import { StorageService } from 'src/app/modules/_services/storage.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  public isSuccess: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router,
    private eventsService: EventsService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this.validateTrasaction();
  }

  validateTrasaction() {
    const paymentRef = this._storageService.getItem("paymentRef");
    console.log("Payment ref", paymentRef);
    this.eventsService.confirmPSE({ Reference: paymentRef })
      .subscribe(res => {
        console.log("Res check ref",res);
        this.isSuccess = true;
      }, err => {
        this.isSuccess = false;
        throw err;
      })
  }

  handleConfirmation() {
    if (this.isSuccess) {
      this._storageService.clear();
      window.location.replace("https://mci12.com/eventos/");
    } else {
      this.router.navigate(['/payment']);
    }
  }

}
