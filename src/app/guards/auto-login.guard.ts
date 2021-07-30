import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(
    private authState: AuthenticationService,
    private router: Router
  ) {}

  /**
   * checks to see if the user has an active login session, if true
   * login page is bypassed.
   * @returns true or false
   */
  canLoad(): Observable<boolean> {
    return this.authState.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        console.log('Found previous token, automatic login', isAuthenticated);
        if (isAuthenticated) {
          this.router.navigateByUrl('/tabs/home', { replaceUrl: true });
        } else {
          return true;
        }
      })
    )
  }
}
