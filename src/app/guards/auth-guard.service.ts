import { AuthService } from './../shared/services/auth.service';
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  CanActivateChild,
  CanLoad,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { FirebaseService } from '../shared/services/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad, CanActivateChild {
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FirebaseService
  ) {}

  canLoad(): boolean | Observable<boolean | UrlTree> {
    return this.redirectIfUnauthenticated();
  }

  canActivate(): boolean | Observable<boolean | UrlTree> {
    return this.redirectIfUnauthenticated();
  }

  canActivateChild(): boolean | Observable<boolean | UrlTree> {
    return this.redirectIfUnauthenticated();
  }

  /**
   * If user has an access token in storage they are logged in and may access page.
   * If not, treat them as logged out.
   */
  private redirectIfUnauthenticated(): boolean | Observable<boolean | UrlTree> {
    return this.authService.CURRENT_USER.pipe(
      map((loggedIn) => {
        console.log('fbGetUsers', loggedIn);

        if (loggedIn) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
