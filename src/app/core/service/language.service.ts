import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public languages: string[] = ['en', 'es', 'de'];

  constructor(public translate: TranslateService, private storageService: StorageService) {
    let browserLang;
    translate.addLangs(this.languages);

    if (this.storageService.getItem('lang')) {
      browserLang = this.storageService.getItem('lang');
    } else {
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|es|de/) ? browserLang : 'en');
  }

  public setLanguage(lang) {
    this.translate.use(lang);    
    this.storageService.setItem('lang', lang);
  }
}
