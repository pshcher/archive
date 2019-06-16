import { Component, OnInit } from '@angular/core';
import { ChangePassword } from 'src/app/models/ChangePassword';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  model: ChangePassword = new ChangePassword();
  submitted: boolean;

  constructor(private authService: AuthService, private router: Router, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.model.name = User.Profile.login;
  }

  onSubmit() {
    this.submitted = true;
    this.authService.changePwd(this.model).subscribe(
      result => {
        if (result) {
          this.model.message = null;
         // User.Profile. = this.model.newPassword;
          let config = new MatSnackBarConfig();
          config.panelClass = result ? undefined : 'errorMsgStyling';
          config.duration = result ? 2000 : 0;
          this.snackBar.open("User " + this.model.name, result ? 'Password Changed OK' : 'Password Change Failed !', config);

          this.router.navigateByUrl("admin");
        }
        else
          this.model.message = "Some error";
      }
    );
  }
}
