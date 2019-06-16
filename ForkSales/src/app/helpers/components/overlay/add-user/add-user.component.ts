import { Component, Inject } from '@angular/core';
import { DTOAddorUpdateUser } from 'src/app/models/DTOs/InDTOs';
import { dtoUser } from 'src/app/models/DTOs/OutDTOs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PERMISSIONS } from "src/app/models/User";
import { ConfirmdlgService } from 'src/app/confirmdlg.service';
import { Util } from 'src/app/helpers/Utilities/compare';
import { keys } from 'ts-transformer-keys';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  model: DTOAddorUpdateUser;

  get permissions() {
    return PERMISSIONS;
  }

  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dtoUser,
    public dlgservice: ConfirmdlgService) {
    this.model = {} as DTOAddorUpdateUser;
  }

  get updatePending() {
    return !Util.isEqual(<DTOAddorUpdateUser>{}, this.model, keys<DTOAddorUpdateUser>());
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
        console.log("Cancel Confirm AddUser dialog");
      else {
        console.log("Proceed Confirm AddUser dialog");
        this.model.Password = ""; //the field is missing from GUI, and being hooked up manually
        this.dialogRef.close(this.model);
      }
    });
  }
}
