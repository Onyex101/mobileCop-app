import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
// import { Observable } from 'rxjs';
import { StorageService } from './../services/storage.service';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(private router: Router, private storage: StorageService) {}

  /**
   * proceeds to intro page the very first time the app is initialised
   * @returns true or false
   */
  async canLoad(): Promise<boolean> {
    const hasSeenIntro = await this.storage.get(INTRO_KEY);
    console.log('hasSeenIntro', hasSeenIntro);
    if (hasSeenIntro) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', {replaceUrl: true});
      return true;
    }
  }
}
