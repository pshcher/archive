import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProceedActionComponent } from './helpers/components/overlay/proceed-action/proceed-action.component';
import { MatDialog } from '@angular/material';
import { AbandonActionComponent } from './helpers/components/overlay/abandon-action/abandon-action.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmdlgService {

  constructor(public dialog: MatDialog) { }

  openProceedDialog(): Observable<boolean>{
    //  openProceedDialog(callback: (data: any) => any): void {
    const dlgRef = this.dialog.open(ProceedActionComponent, {
      width: '300px'
    });

    return dlgRef.afterClosed();
  }

  openAbandonlDialog(): Observable<boolean>{
    //  openProceedDialog(callback: (data: any) => any): void {
    const dlgRef = this.dialog.open(AbandonActionComponent, {
      width: '300px'
    });

    return dlgRef.afterClosed();
  }}
