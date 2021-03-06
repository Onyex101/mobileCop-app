import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authState: AuthenticationService,
    private router: Router
  ) {}

  /**
   * checks current authentications status before a user can proceed to the next page
   * @returns true or false
   */
  canLoad(): Observable<boolean> {
    return this.authState.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {    
          return true;
        } else {          
          this.router.navigateByUrl('/login')
          return false;
        }
      })
    )
  }
}
