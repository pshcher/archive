import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared.module';
import { AdminComponent } from './admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageManagersComponent } from './manage-managers/manage-managers.component';
import { ConfirmPwdDirective } from './change-password/confirm-pwd.directive';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    ChangePasswordComponent,
    ManageUsersComponent,
    ManageManagersComponent,
    ConfirmPwdDirective]
})
export class AdminModule { 
  constructor() {};
}
