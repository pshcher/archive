import { Component, OnInit, ViewChild } from '@angular/core';
//import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ConfirmDeleteComponent } from 'src/app/helpers/components/overlay/confirm-delete/confirm-delete.component';
import { AdminService } from '../admin.service';
import { DTODatasetOut } from 'src/app/models/DTOs/OutDTOs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

interface dtoUser {
  user_id: number;
  user_name: string;
  password: string;
  cc_line: string;
  permission: string;
  manager_id: string;
}

@Component({
  selector: 'app-manage-managers',
  templateUrl: './manage-managers.component.html',
  styleUrls: ['./manage-managers.component.css']
})
export class ManageManagersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['delete', 'edit', 'confirm', 'user_id', 'user_name', 'cc_line', 'permission', 'manager_id'];
  USERS: dtoUser[] = [];
  dataSource;
  userName: string;
  message: any;

  constructor(public dialog: MatDialog, private adminService: AdminService) { }

  openDialog(val): void {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      width: '300px',
      data: { name: val.user_name, id: val.user_id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.userName = result;
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.adminService.getUsers().subscribe(
      (users: DTODatasetOut) => {
        if (users) {   // dtoUser
          this.message = users.Message
          if (users.Status) {
            console.log(users.Message);
            // User settings
            var dsUsers = users.DS;
            if (dsUsers == null || dsUsers.user_manager.length <= 0) { //TODO: user_manager ??? change name ???
              this.message = "getUsers: Error retrieving users";
            }
            else {
              for (let dr of dsUsers.user_manager) {
                var user = {
                  user_id: dr.user_id,
                  user_name: dr.user_name,
                  password: dr.password,
                  cc_line: dr.cc_line,
                  permission: dr.permission,
                  manager_id: dr.manager_id
                };
                this.USERS.push(user);
              }

              this.dataSource = new MatTableDataSource<dtoUser>(this.USERS);
              this.dataSource.paginator = this.paginator;
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
}