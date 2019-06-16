import { Injectable, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { catchError, tap } from 'rxjs/operators';
import { DTODatasetOut, DTOBaseOut, DTODeleteUserOut, DTOConfirmUserOut, Manager, UserManager, UserManagerBase } from '../models/DTOs/OutDTOs';
import { DTOAddorUpdateUser, DTOAddorUpdateUser2 } from '../models/DTOs/InDTOs';
import { Observable, of } from 'rxjs';
import { Util } from '../helpers/Utilities/compare';
import { keys } from 'ts-transformer-keys';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json' //'application/x-www-form-urlencoded' //
  })
};

const apiUrl: string = "http://GITSWK-VDIWV005/CSApi/";
const Managers: Manager[] = [
  { manager_id: '1', first_name: 'AA1', last_name: 'BB', position: '111', e_mail: 'a@b.com' },
  { manager_id: '2', first_name: 'AA2', last_name: 'BB2345', position: '111', e_mail: 'a@b.com' },
  { manager_id: '3', first_name: 'AA3', last_name: 'BB', position: '111', e_mail: 'a@b.com' },
  { manager_id: '4', first_name: 'AA4', last_name: 'B444B', position: '111', e_mail: 'a@b.com' },
  { manager_id: '5', first_name: 'AA5', last_name: 'BB', position: '111', e_mail: 'a@b.com' },
  { manager_id: '6', first_name: 'AA6', last_name: 'B67788B', position: '111', e_mail: 'a@b.com' },
  { manager_id: '7', first_name: 'AA7', last_name: 'BB', position: '111', e_mail: 'a@b.com' },
  { manager_id: '8', first_name: 'AA8', last_name: 'BB', position: '111', e_mail: 'a@b.com' },
  { manager_id: '9', first_name: 'AA9', last_name: 'B5555B', position: '111', e_mail: 'a@b.com' },
  { manager_id: '10', first_name: 'AA10', last_name: 'BB', position: '111', e_mail: 'a@b.com' }
];

const UserManagers: UserManager[] = [
  { user_id: 1, source_A: 'sa1', source_B: 'sb1', manager_id: '1', e_mail: 'a@b.com', cc_line: 'ccl1', mgrFullName: '', inList: true },
  { user_id: 1, source_A: 'sa2', source_B: 'sb1', manager_id: '2', e_mail: 'a@b.com', cc_line: 'ccl2', mgrFullName: '', inList: true },
  { user_id: 1, source_A: 'sa1', source_B: 'sb3', manager_id: '3', e_mail: 'a@b.com', cc_line: 'ccl3', mgrFullName: '', inList: true },
  { user_id: 1, source_A: 'sa1', source_B: 'sb1', manager_id: '4', e_mail: 'a@b.com', cc_line: 'ccl4', mgrFullName: '', inList: true },
  { user_id: 1, source_A: 'sa1', source_B: 'sb1', manager_id: '5', e_mail: 'a@b.com', cc_line: 'ccl5', mgrFullName: '', inList: true },
  { user_id: 1, source_A: 'sa1', source_B: 'sb1', manager_id: '6', e_mail: 'a@b.com', cc_line: 'ccl6', mgrFullName: '', inList: true }
];

//const keysOfProps = keys<UserManagerBase>();

@Injectable({
  providedIn: 'root'
})
export class AdminService implements OnInit {
  managers: Manager[];
  userManagersOriginal: UserManager[];
  private handleError: HandleError;

  ngOnInit(): void {
    this.getUsers();
  }

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AuthenticationService');
  }

  getUsers(): any {
    var query = apiUrl + "api/Admin/GetUsers2";
    return this.http.get<DTODatasetOut>(query)
      .pipe(
        catchError(this.handleError('SelectSecurityTypes', []))
      );
  }

  //TODO: confirmUser does delete, this one not used, it is  weird ???
  deleteUser(name: string): Observable<DTODeleteUserOut> {
    return this.http.post<any>(apiUrl + 'api/Admin/DeleteUser', JSON.stringify(name), httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('Delete User'))
      );
  }

  confirmUser(name: string): Observable<DTOConfirmUserOut> {
    return this.http.post<any>(apiUrl + 'api/Admin/ConfirmUser', JSON.stringify(name), httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('Confirm User'))
      );
  }
  addUser(user: DTOAddorUpdateUser): Observable<DTOBaseOut> {
    return this.http.post<any>(apiUrl + 'api/Admin/AddUser', user, httpOptions)
      .pipe(
        catchError(this.handleError<boolean>('Add User'))
      );
  }

  updateUser(user: DTOAddorUpdateUser2): Observable<DTOBaseOut> {
    return this.http.post<any>(apiUrl + 'api/Admin/UpdateUser2', user, httpOptions)
      .pipe(
        //        tap((a: DTOBaseOut)=>{User.Profile = new UserProfile(); User.Profile.login = dataIn.Name }),
        catchError(this.handleError<boolean>('Update User'))
      );
  }

  //TODO: stuff!!!
  updateUserManagers(users: UserManager[]): Observable<DTOBaseOut> {
    //todo: compare with original, create 2 collections: add/update and delete

    var ret = this.getUserManagersChange(users);

    return of({} as DTOBaseOut);

    /*     return this.http.post<any>(apiUrl + 'api/Admin/UpdateUser2', user, httpOptions)
          .pipe(
            //        tap((a: DTOBaseOut)=>{User.Profile = new UserProfile(); User.Profile.login = dataIn.Name }),
            catchError(this.handleError<boolean>('Update User'))
          ); */
  }

  // in progress
  getAllManagers(): Observable<Manager[]> {
    return of(Managers)
      .pipe(
        tap((a: Manager[]) => this.managers = a),
        catchError(this.handleError<Manager[]>('getAllManagers'))
      );
  }

  getUserManagers(): Observable<UserManager[]> {
    var tempUM = UserManagers;
    return of(tempUM)
      .pipe(
        tap((arr: UserManager[]) => this.userManagersOriginal = JSON.parse(JSON.stringify(arr))),
        catchError(this.handleError<UserManager[]>('getUserManagers'))
      );
  }

  getUserManagersChange(ums: UserManager[]) {
    //deleted
    var deleted = this.userManagersOriginal.filter(umo => {
      return ums.some(umn => umn.manager_id === umo.manager_id &&
        umn.inList == false && umo.inList == true);
    })

    var dids = deleted.map(d => d.manager_id);
    console.log('Deleted:' + dids.join(','));

    var added = ums.filter(umn => {
      return this.userManagersOriginal.some(
        umo => umo.manager_id === umn.manager_id &&
          umn.inList == true && umo.inList == false);
    })
    console.log('Added:' + JSON.stringify(added));

    var updated = ums.filter(umn => {
      //TODO: Cast t6o UserManagerBase DOES NOT WORK, figure out!!!
      return this.userManagersOriginal.some(
        umo => umo.manager_id === umn.manager_id &&
          umn.inList == true && umo.inList == true 
//          &&  !Util.isEqual(umn, umo, keysOfProps)
            );
    })
    console.log('Updated:' + JSON.stringify(updated));

    return { deleted: dids, added: added, updated: updated };

  }
}
