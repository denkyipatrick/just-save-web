import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-please-wait-dialog',
  templateUrl: './please-wait-dialog.component.html',
  styleUrls: ['./please-wait-dialog.component.scss']
})
export class PleaseWaitDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PleaseWaitDialogComponent>) { }

  ngOnInit(): void {
  }

}
