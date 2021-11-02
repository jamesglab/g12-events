import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
declare global {
  interface Window {
    keybe: any;
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'g12-events';
  constructor(public translate: TranslateService) {
    translate.addLangs(['es', 'en', 'fr', 'pt', 'ru']);
  }

  ngOnInit() {
    this.createKeybe();
  }



  createKeybe() {
    var keybe = document.getElementById('keybe')
    var script = document.createElement('script');
    script.src = "https://storage.googleapis.com/keybejs/4.7.2/keybe.js?version=4.7.2";
    script.id = "keybe-script";
    script.setAttribute("async", "true");
    keybe.appendChild(script);
    var configChat = {
      apiKey: 'cd479f2ee58840e68a3abe2a42e2f5d7',
      // app_name: 'mision carismatica'
    }
    // setTimeout(() => {
    window.keybe.webchatConversationsUiLoad(configChat);
    // }, 1000)
  }

}
