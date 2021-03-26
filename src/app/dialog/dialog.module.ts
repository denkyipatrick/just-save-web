import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OkCancelDialogComponent } from './ok-cancel-dialog/ok-cancel-dialog.component';
import { OkDialogComponent } from './ok-dialog/ok-dialog.component';
import { PleaseWaitDialogComponent } from './please-wait-dialog/please-wait-dialog.component';

@NgModule({
  declarations: [
    OkCancelDialogComponent, 
    OkDialogComponent, 
    PleaseWaitDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    OkCancelDialogComponent, OkDialogComponent
  ]
})
export class DialogModule { }
