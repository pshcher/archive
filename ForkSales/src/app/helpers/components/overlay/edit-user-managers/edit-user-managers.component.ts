import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig, MatDialog } from '@angular/material';
import { dtoUser, ManagerEx } from 'src/app/models/DTOs/OutDTOs';
import { AdminService } from 'src/app/admin/admin.service';
import { ConfirmdlgService } from 'src/app/confirmdlg.service';

@Component({
  selector: 'app-edit-user-managers',
  templateUrl: './edit-user-managers.component.html',
  styleUrls: ['./edit-user-managers.component.css']
})
export class EditUserManagersComponent implements OnInit {
  managersEx: ManagerEx[];
  userManagerToAdd: ManagerEx = {} as ManagerEx;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  updatePending = false;

  get showUserManagers() {
    return this.managersEx.filter(um => um.inList == true);
  }

  constructor(public dialogRef: MatDialogRef<EditUserManagersComponent>,
    public dlgservice: ConfirmdlgService,
    @Inject(MAT_DIALOG_DATA) public data: dtoUser,
    public adminService: AdminService, public snackBar: MatSnackBar) { }

  onNoClick(): void {
    if (this.updatePending) {
      this.dlgservice.openAbandonlDialog().subscribe(result => {
        if (!result)
          console.log("Cancel Abandon dialog");
        else {
          //TODO: the update should be here
          console.log("Abandon Dlg Proceed");
          this.dialogRef.close();
        }
      });
    }
    else
      this.dialogRef.close();
  }

  onYesClick(): void {
    this.dlgservice.openProceedDialog().subscribe(result => {
      if (!result)
        console.log("Cancel Confirm dialog");
      else {
        //TODO: the update should be here
        console.log("Confirm Dlg Proceed");
        this.dialogRef.close(this.managersEx);
      }
    });
  }


  ngOnInit() {
    this.adminService.getAllManagers().subscribe(mgrs => {
      this.adminService.getUserManagers().subscribe(umgrs => {
        this.managersEx = mgrs.map(m => {
          let mgrEx = <ManagerEx>{};
          mgrEx.manager_id = m.manager_id;
          mgrEx.mgrFullName = m.first_name + ' ' + m.last_name;
          mgrEx.inList = false;
          mgrEx.cc_line = mgrEx.source_A = mgrEx.source_B = '';
          mgrEx.e_mail = m.e_mail;

          var uMngrs = umgrs.filter(um => um.manager_id == m.manager_id);
          if (uMngrs && uMngrs.length > 0) {
            mgrEx.inList = true;
            mgrEx.cc_line = uMngrs[0].cc_line;
            mgrEx.source_A = uMngrs[0].source_A;
            mgrEx.source_B = uMngrs[0].source_B;
            mgrEx.user_id = uMngrs[0].user_id;
          }
          return mgrEx;
        })
      });
    });
  }

  addMgr(): void {
    this.userManagerToAdd.inList = true;

    this.snackBar.open("User Managers Selection",
      this.userManagerToAdd.mgrFullName + " update is pending",
      { duration: 2000 });
    this.updatePending = true;
  }

  remove(mex: ManagerEx): void {
    const index = this.managersEx.findIndex(m => m.manager_id == mex.manager_id);

    if (index >= 0) {
      this.managersEx[index].inList = false;
      this.updatePending = true;
    }
  }
}
