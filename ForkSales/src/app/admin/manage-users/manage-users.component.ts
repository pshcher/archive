import { Component, OnInit, ViewChild } from '@angular/core';
//import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ConfirmDeleteComponent } from 'src/app/helpers/components/overlay/confirm-delete/confirm-delete.component';
import { AdminService } from '../admin.service';
import { dtoUser, DTODatasetOut, UserManager } from 'src/app/models/DTOs/OutDTOs';
import { ConfirmConfirmComponent } from 'src/app/helpers/components/overlay/confirm-confirm/confirm-confirm.component';
import { UpdateUserComponent } from 'src/app/helpers/components/overlay/update-user/update-user.component';
import { AddUserComponent } from 'src/app/helpers/components/overlay/add-user/add-user.component';
import { EditUserManagersComponent } from 'src/app/helpers/components/overlay/edit-user-managers/edit-user-managers.component';
import { ProceedActionComponent } from 'src/app/helpers/components/overlay/proceed-action/proceed-action.component';
import { Util } from 'src/app/helpers/Utilities/compare';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['edit', 'delete', 'managers', 'user_id', 'user_name', 'cc_line', 'permission', 'manager_id'];
  Users: dtoUser[] = [];
  dataSource;
  userName: string;
  message: any;
  findusers = "";

  constructor(public dialog: MatDialog, private adminService: AdminService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.adminService.getUsers().subscribe(
      (users: DTODatasetOut) => {
        if (users) {   // dtoUser
          this.Users = [];
          this.message = users.Message
          if (users.Status) {
            console.log(users.Message);
            var dsUsers = users.DS;
            if (dsUsers == null || dsUsers.user_manager.length <= 0) { //TODO: user_manager ??? change name ???
              this.message = "getUsers: Error retrieving users";
            }
            else {
              for (let dr of dsUsers.user_manager) {
                var user = {
                  user_id: dr.user_id,
                  user_name: dr.user_name.trim(),
                  cash_order_code: dr.CASH_ORDER_CODE.trim(),
                  cc_line: dr.cc_line.trim(),
                  permission: dr.permission.trim(),
                  manager_id: dr.manager_id.trim()
                };
                this.Users.push(user);
              }

              this.refreshTable();
            }
          }
          else
            console.log(this.message);
        }
        else {
          this.message = "Application Exception retrieving Users, contact app support.";
          console.log('Exception while retrieving users');
        }
      }
    );
  }


  refreshTable() {
    this.dataSource = new MatTableDataSource<dtoUser>(this.Users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.firstPage();
    this.findusers = "";
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openUserManagersEditDialog(val): void { //TODO
    const dialogRef = this.dialog.open(EditUserManagersComponent, {
      width: '600px',
      data: val,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((editModel: UserManager[]) => {
      console.log('The Edit UserManagers dialog was closed');

      if (editModel) {
        this.adminService.updateUserManagers(editModel).subscribe(updateResult => {
          let config = new MatSnackBarConfig();
          config.panelClass = updateResult.Status ? undefined : 'errorMsgStyling';
          config.duration = updateResult.Status ? 2000 : 0;

          //  this.snackBar.open("User Managers " + editModel.UserName, updateResult.Status ? "Updated OK" : "Update Failed", config);
        });
      }
    });
  }

  openEditDialog(val): void { //TODO
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      width: '500px',
      data: val,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(editModel => {
      console.log('The Edit User dialog was closed');

      if (editModel) {
        this.adminService.updateUser(editModel).subscribe(updateResult => {
          let config = new MatSnackBarConfig();
          config.panelClass = updateResult.Status ? undefined : 'errorMsgStyling';
          config.duration = updateResult.Status ? 2000 : 0;

          this.snackBar.open("User " + editModel.UserName,
            updateResult.Status ? "Updated OK" : "Update Failed", config);
          this.getUsers();
        });
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, { width: '500px', disableClose: true });

    dialogRef.afterClosed().subscribe(addModel => {
      console.log('The Add User dialog was closed');

      if (addModel) {
        //Make sure no null value fields
        addModel = Util.replaceNullsWithEmptiyStrings(addModel);

        this.adminService.addUser(addModel).subscribe(addResult => {
          let config = new MatSnackBarConfig();
          config.panelClass = addResult.Status ? undefined : 'errorMsgStyling';
          config.duration = addResult.Status ? 2000 : 0;

          this.snackBar.open("User " + addModel.Name, addResult.Status ? 'Added OK' : 'Addition Failed !', config);
          if (addResult.Status)
            this.getUsers();
        });
      }
    });
  }

  openConfirmDialog(val): void {
    const dialogRef = this.dialog.open(ConfirmConfirmComponent, {
      width: '300px',
      data: { name: val.user_name, id: val.user_id },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(selectedRowModel => {
      console.log('The Confirm dialog was closed');

      if (selectedRowModel) {
        let name: string = selectedRowModel.name;
        this.adminService.confirmUser(name).subscribe(confirmResult => {
          let config = new MatSnackBarConfig();
          config.panelClass = confirmResult.Status ? undefined : 'errorMsgStyling';
          config.duration = confirmResult.Status ? 2000 : 0;

          this.snackBar.open("User " + selectedRowModel.name, confirmResult.Status ? 'Confirmed OK' : 'Confirmation Failed !', config);
        });
      }
    });
  }


  openDeleteDialog(val): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: { name: val.user_name, id: val.user_id },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(selectedRowModel => {
      console.log('The dialog was closed');

      if (selectedRowModel) {
        let name: string = selectedRowModel.name;
        //       this.adminService.deleteUser(name).subscribe(deleteResult => {
        this.adminService.confirmUser(name).subscribe(deleteResult => { //Confirm ACTUALLY deletes user, so use it instead of adminService.deleteUser
          if (deleteResult.Status) {
            this.Users = this.Users.filter(u => u.user_name != selectedRowModel.name);
            this.refreshTable();
          }

          let config = new MatSnackBarConfig();
          config.panelClass = deleteResult.Status ? undefined : 'errorMsgStyling';
          config.duration = deleteResult.Status ? 2000 : 0;

          this.snackBar.open("User " + selectedRowModel.name, deleteResult.Status ? 'Deleted OK' : 'Deletion Failed !', config);
        });
      }
    });
  }
}