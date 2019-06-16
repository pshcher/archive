import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from '../auth/auth.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageManagersComponent } from './manage-managers/manage-managers.component';

 const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'changepwd', component: ChangePasswordComponent },
          { path: 'users', component: ManageUsersComponent },
          { path: 'managers', component: ManageManagersComponent },
          { path: '', redirectTo: 'users', pathMatch: 'full' },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
