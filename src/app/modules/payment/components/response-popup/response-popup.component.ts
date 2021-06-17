import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StorageService } from 'src/app/modules/_services/storage.service';
import { EventsService } from 'src/app/modules/_services/events.service';

@Component({
  selector: 'app-response-popup',
  templateUrl: './response-popup.component.html',
  styleUrls: ['./response-popup.component.css']
})
export class ResponsePopupComponent implements OnInit {

  public response: any = null;

  constructor(public dialog: MatDialogRef<ResponsePopupComponent>,
    private eventsService: EventsService, private cdr: ChangeDetectorRef,
    private storage: StorageService) { }

  ngOnInit(): void {
    //console.log("RESPONSE POPUP", this.response);
    //console.log("Response Popup:")
    //console.log(this.response)
    // if(this.response.state != "FAILED"){
    //   this.eventsService.insertFirebaseTransaction(this.response.data);
    // }
    // console.log("COMO LLEGA EL RESPONSE AL DIALOG", this.response);
    this.cdr.detectChanges();
  }

  redirectAgain() {
    setTimeout(() => { window.open(this.response.url, '_blank'); }, 500);
  }

  messageTitle(titles: string) {

    let title: string = "";
    switch (titles) {
      case "SUCCESS":
        title = 'Yayy!';
        break;

      case "pse":
      case "PENDING":
        title = 'Transacción Pendiente';
        break;
      case "FAILED":
        title = 'Oops!';
        break;

      default:
        title = 'Oops!'
        break;
    }
    return title;
  }

  handleClose(){
    this.dialog.close(this.response)
  }

}
