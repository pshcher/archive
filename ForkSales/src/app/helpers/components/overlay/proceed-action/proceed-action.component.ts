import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-proceed-action',
  templateUrl: './proceed-action.component.html',
  styleUrls: ['./proceed-action.component.css']
})
export class ProceedActionComponent {

  constructor(
    public dialogRef: MatDialogRef<ProceedActionComponent>) {}
  
}
