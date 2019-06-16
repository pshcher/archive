import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Login } from 'src/app/models/Login';
import { Router, ActivatedRoute } from '@angular/router';
import { DTOLoginOut, DTODatasetOut } from 'src/app/models/DTOs/OutDTOs';
import { DTOLogin } from 'src/app/models/DTOs/InDTOs';
import { User, UserProfile } from 'src/app/models/User';
import fs from 'node_modules/file-saver';
//import { saveAs } from 'file-saver';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {  //implements OnInit
  ds: any;
  model: Login = new Login();
  submitted = false;
  loading: boolean = false;

  //TODO: used in sleep for testing only
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.getDataSet();
    this.authService.currentView = this.router.url;
    this.authService.logout();

    const lostPwdCode = this.route.snapshot.queryParamMap.get('helpercode');
    if (lostPwdCode)
      this.router.navigate(["admin"]);
      // /changepwd
  }

  /*  getDataSet(){
      this.as.getDataSet( ).subscribe( t=>{
        this.ds = t;
      console.log(this.ds);   // console.log(this.ds.medications.length); console.log(this.ds.medications[1].medication);
     }
    );
  }
  */

 async onSubmitTest() {
 
  this.authService.logintest().subscribe(()=>
    this.router.navigate(['orders']) // reports

     );
}

onSave(){
  // var file = new File(["Hello, world!"], "hello world.txt", {type: "text/plain;charset=utf-8"});

  // fs.saveAs(file);

  var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
  fs.saveAs(blob, "hello world.txt");
}

doRotate = false;
onRotate()
{
  this.doRotate = !this.doRotate;
}


  async onSubmit() {
    this.model.name = this.model.name.trim();
    this.submitted = true;
    this.loading = true;

    //TODO: Remove
    //await this.sleep(2000);

    var dtoLogin = <DTOLogin>{};
    dtoLogin.Name = this.model.name;
    dtoLogin.Password = this.model.password;

    this.authService.login(dtoLogin).subscribe(
      (resultLogin: DTOLoginOut) => {
        if (resultLogin) {   //     DTOLoginOut
          this.model.message = resultLogin.Message
          if (resultLogin.Status) {
            User.Profile = new UserProfile();
            User.Profile.login = dtoLogin.Name
            console.log('User :' + dtoLogin.Name + ' has mgr_id: ' + resultLogin.ManagerCode);
            this.getUserSecurityTypes(dtoLogin.Name);
          }
          else {
            User.Profile = null;
            console.log(this.model.message);
            this.loading = false;
          }
        }
        else {
          this.model.message = "Application Exception trying to login, contact app support.";
          console.log('Exception: resultLogin INVALID');
        }
      }
    );
  }

  getUserSecurityTypes(name: string): void {
   this.authService.getUserSecurityTypes(name).subscribe(
      (resultSecTypes: DTODatasetOut) => {
        if (resultSecTypes) {   //     DTOLoginOut
          this.model.message = resultSecTypes.Message
          if (resultSecTypes.Status) {
            console.log(resultSecTypes.Message);
            // User settings
            var dsSecurityFlags = resultSecTypes.DS;
            if (dsSecurityFlags == null || dsSecurityFlags.users_security.length <= 0) {
              this.model.message = "Login: Error obtaining Security Types";
            }
            else {
              for (let dr of dsSecurityFlags.users_security) {
                User.Profile.Permission = dr.permission;
                User.Profile.RejectScreen = dr.Allow_Reject_screen;
                User.Profile.OrderScreen = dr.Allow_Order_screen;
                User.Profile.SubmitScreen = dr.Allow_Submit_screen;
                User.Profile.AdminScreen = dr.Allow_Admin_screen;
                User.Profile.FullReport = dr.Full_Report;
                if (dr.permission == "ADMIN") {
                  User.Profile.pAdminS = true;
                }
                else {
                  User.Profile.pAdminS = false;
                }
              }

              //  if (User.Profile.OrderScreen == "Y")
              //     this.router.navigate(["/orders"]);     
              //   else if (User.Profile.SubmitScreen == "Y")
              //     this.router.navigateByUrl("submittedorders");
              //   else if (User.Profile.RejectScreen == "Y")
              //     this.router.navigateByUrl("rejectedorders");
              //   //TODO
              //   else
              //     this.router.navigate(['admin']);
              this.router.navigate(['admin']); // reports
            }
          }
          else
            console.log(this.model.message);
        }
        else {
          this.model.message = "Application Exception retrieving security types, contact app support.";
          console.log('Exception: resultLogin INVALID');
        }
      }
    );
    this.loading = false;
  }


  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

}
