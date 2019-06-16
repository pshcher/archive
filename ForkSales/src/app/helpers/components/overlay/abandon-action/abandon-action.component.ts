import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-abandon-action',
  templateUrl: './abandon-action.component.html',
  styleUrls: ['./abandon-action.component.css']
})
export class AbandonActionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AbandonActionComponent>) { }

  ngOnInit() {
  }

}
