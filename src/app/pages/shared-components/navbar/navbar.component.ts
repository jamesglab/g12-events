import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public currentLanguage = localStorage.getItem('language');
  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {

    if (this.currentLanguage) {
      this.changeLang(this.currentLanguage);
    }else {
      this.changeLang('es')
    }
  }

  changeLang(lang) {
    try {
      localStorage.setItem('language', lang)
      this.currentLanguage = lang
      this.translate.use(lang);
    } catch (error) {
      throw error;
    }

  }


}
