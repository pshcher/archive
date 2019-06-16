import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild  {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.canActivate(childRoute, state);
  }

  canActivate(  next: ActivatedRouteSnapshot,  state: RouterStateSnapshot) {
    console.log('AuthGuard#canActivate called');
    let url: string = state.url;
    this.authService.currentView = url;
    this.authService.navigationError = false; //reset

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (User.Profile ) 
      return true;

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['login']);
    return false;  
  }
}
