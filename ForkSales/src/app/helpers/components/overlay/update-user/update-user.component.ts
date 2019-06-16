import { Component, Inject } from '@angular/core';
import { DTOAddorUpdateUser2 } from 'src/app/models/DTOs/InDTOs';
import { dtoUser } from 'src/app/models/DTOs/OutDTOs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PERMISSIONS } from "src/app/models/User";
import { Util } from 'src/app/helpers/Utilities/compare';
import { ConfirmdlgService } from 'src/app/confirmdlg.service';
import { keys } from 'ts-transformer-keys';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent {
  model: DTOAddorUpdateUser2;
  modelBUP: DTOAddorUpdateUser2;

  get permissions() {
    return PERMISSIONS;
  }

  constructor(public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dtoUser,
    public dlgservice: ConfirmdlgService) {
    this.model = {} as DTOAddorUpdateUser2;
    this.modelBUP = {} as DTOAddorUpdateUser2;

    this.modelBUP.UserId = this.model.UserId = data.user_id;
    this.modelBUP.UserName = this.model.UserName = data.user_name;
    this.modelBUP.MngrId = this.model.MngrId = data.manager_id;
    this.modelBUP.CCLine = this.model.CCLine = data.cc_line;
    this.modelBUP.CashCode = this.model.CashCode = data.cash_order_code;
    this.modelBUP.Permission = this.model.Permission = data.permission;
  }

  get updatePending() {
    return !Util.isEqual(this.modelBUP, this.model, keys<DTOAddorUpdateUser2>());
  }

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
        this.dialogRef.close(this.model);
      }
    });
  }




}
