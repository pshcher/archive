import { Injectable } from '@angular/core';
import { Alert } from './models/misc';

@Injectable()
export class MessageService {
  //add functionality to remove a message at a time, and make the next one currentMessage

  messages: Alert[] = []; 
  currentMessage: Alert = null; 

  add(message: Alert) {
    this.messages.push(message);
    this.currentMessage = this.messages[0];
  }

  deleteCurrent(){
    if (this.messages && this.messages.length){
      this.messages.shift();
      
      this.currentMessage = (this.messages && this.messages.length) ? this.messages[0] : null     
    }
  }

  clear() {
    this.messages = [];
    this.currentMessage = null;
  }
}
