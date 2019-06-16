import { Component } from '@angular/core';
import { MessageService } from './message.service';
import { AlertType } from './models/misc';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import appsetting from 'src/assets/appsettings.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  f = appsetting;

  get message() {
    return this.showMessage? this.messageService.currentMessage.Message : "";
  }

  get showMessage() {
    return this.messageService.currentMessage != null;
  }

  get isInfo(){
    return this.messageService.currentMessage ? 
      this.messageService.currentMessage.Type == AlertType.Info : false;
  }
  
  get isWarning(){
    return this.messageService.currentMessage ? 
      this.messageService.currentMessage.Type == AlertType.Warning : false;
  }
  get isError(){
    return this.messageService.currentMessage ? 
      this.messageService.currentMessage.Type == AlertType.Error : false;
  }
  
  constructor(private messageService: MessageService,private router: Router
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationStart) => {
      //console.log(event.url);
      this.messageService.clear();
    });
  }

  onAlertClose() {
   this.messageService.deleteCurrent();
  }

  title = 'am2';
  template: string = `<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
}
