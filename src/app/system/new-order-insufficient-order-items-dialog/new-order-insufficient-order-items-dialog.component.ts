import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-order-insufficient-order-items-dialog',
  templateUrl: './new-order-insufficient-order-items-dialog.component.html',
  styleUrls: ['./new-order-insufficient-order-items-dialog.component.scss']
})
export class NewOrderInsufficientOrderItemsDialogComponent implements OnInit {
  items: any[];

  constructor(
    private dialogRef: MatDialogRef<NewOrderInsufficientOrderItemsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit(): void {
    this.items = JSON.parse(this.data.items);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
