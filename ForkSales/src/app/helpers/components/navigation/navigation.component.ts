import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  //@Input() topMenu : boolean;

  navbarOpen = true;
  ngOnInit() { }

  get topMenu() {
    return this.authService.topMenu;
  }

  get secondaryMenu() {
    return this.authService.secondaryMenu;
  }

  constructor(public authService: AuthService, private router: Router) { }

  activeView ='home';
  getStatus(val)
  {
    return (this.activeView == val) ? 'active' : '';
  }
  
  setActive(val){
    this.activeView = val;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['login']);
    ;
  }

  gotoLogin() {
    this.onLogout();
  }

  get isLogin(): boolean {
    return this.authService.currentView == '/login';
  }

  responsiveMenuClass = '';

  toggleMenu() {
    if (this.responsiveMenuClass == 'active')
      this.responsiveMenuClass = ''
    else
      this.responsiveMenuClass = 'active';
  }

  diagnostic(obj) {
    return JSON.stringify(obj.display);
  }

}
