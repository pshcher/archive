import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Login } from '../models/Login';
import { ChangePassword } from '../models/ChangePassword';
import { DTOLogin } from '../models/DTOs/InDTOs';
import { DTOLoginOut, DTODatasetOut } from '../models/DTOs/OutDTOs';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { User, UserProfile } from '../models/User';

interface menuItem {
  display: string;
  url: string;
  isActive: boolean;
  parent: string;
  order: number;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json' //'application/x-www-form-urlencoded' //
 //   ,'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  navigationError = false;
  currentView: string = "login"; //initialize
  redirectUrl:  string = '';

  get isLoggedIn(){
    return User.Profile != null;
  }
  //TODO:
  apiUrl: string = "http://GITSWK-VDIWV005/CSApi/";
  private handleError: HandleError;

  menuItems: menuItem[];

  allMenuItems: menuItem[] = [
    { "display": "Login", "url": "/login", "isActive": true, "parent": null, "order": 1 },
    { "display": "Admin", "url": "/admin", "isActive": true, "parent": null, "order": 1 },
    { "display": "Orders", "url": "/orders", "isActive": false, "parent": null, "order": 3 },
    { "display": "Reports", "url": "/reports", "isActive": false, "parent": null, "order": 4 },
    { "display": "Users", "url": "/admin/users", "isActive": false, "parent": "/admin", "order": 4 },
    { "display": "Managers", "url": "/admin/managers", "isActive": false, "parent": "/admin", "order": 4 },
    { "display": "Password Change", "url": "/admin/changepwd", "isActive": true, "parent": "/admin", "order": 1 },
    { "display": "New Order", "url": "/orders/neworder", "isActive": false, "parent": "/orders", "order": 1 },
    { "display": "Pending Order", "url": "/orders/pendingorders", "isActive": false, "parent": "/orders", "order": 2 },
    { "display": "Rejected Order", "url": "/reports/rejectedorders", "isActive": false, "parent": "/reports", "order": 3 },
    { "display": "Submitted Order", "url": "/reports/submittedorders", "isActive": false, "parent": "/reports", "order": 4 }
  ];

  get topMenu(): menuItem[] {
    return this.allMenuItems.filter(mi => mi.parent === null).sort(mi => mi.order);
  }

  get secondaryMenu(): menuItem[] {
    if (!this.navigationError) {
      let secItems = this.allMenuItems.filter(mi => mi.parent != null &&
        mi.url == this.currentView);

      if (secItems && secItems.length > 0) {
        let parent = secItems[0].parent;
        return this.allMenuItems.filter(mi => mi.parent === parent).sort(mi => mi.order);
      }
    }
    return [];
  }

   constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AuthenticationService');
  }

  get userGreeting() {
    if ( User.Profile )
      return "Hello " + User.Profile.login + "!";
    else
      return "Please Log-In";
  }

  login(dataIn: DTOLogin): Observable<DTOLoginOut> {
    return this.http.post<DTOLoginOut>(this.apiUrl + 'api/Admin', dataIn, httpOptions)
      .pipe(
//        tap((a: DTOLoginOut)=>{User.Profile = new UserProfile(); User.Profile.login = dataIn.Name }),
        catchError(this.handleError<DTOLoginOut>('Login'))
      ); 
  }

  logintest(): Observable<any> {
    // let bRet = false;
    //  return of(bRet).pipe(
    //   delay(200),
    //   tap(val => {
    //     User.Profile = new UserProfile(); User.Profile.login = 'Paul';
    //   })
    // );
    let ordersUrl = 'api/orders';  // URL to web api
    return this.http.get<any[]>( ordersUrl ).pipe(
      tap(val => {
         User.Profile = new UserProfile(); User.Profile.login = 'Paul';
       })
    );
  } 

  getUserSecurityTypes(name: string): any {
    var query = this.apiUrl + "api/Admin/SelectSecurityTypes?userName=" + name;
    return this.http.get<DTODatasetOut>( query )
    .pipe(
      catchError(this.handleError('SelectSecurityTypes', []))
    );  
  }

  changePwd(data: ChangePassword): Observable<boolean> {
    let bRet = false;
    if (data.name == "Paul" && data.newPassword != null)
      bRet = true;

    return of(bRet).pipe(
      delay(200),
      tap(val => {
        User.Profile = new UserProfile(); 
        User.Profile.login = bRet ? data.name : null;
      })
    );
  }

  logout(): void {
    User.Profile = null;
  }



}
