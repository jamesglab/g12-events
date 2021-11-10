import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public currentLanguage = localStorage.getItem('language');
  public select_language = new FormControl(this.currentLanguage? this.currentLanguage : 'es');
  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {

    if (this.currentLanguage) {
      this.changeLang(this.currentLanguage);
    }else {
      this.changeLang('es')
    }

    this.select_language.valueChanges.subscribe(res=>{
      this.changeLang(res);
    })
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
