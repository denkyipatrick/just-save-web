import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ok-cancel-dialog',
  templateUrl: './ok-cancel-dialog.component.html',
  styleUrls: ['./ok-cancel-dialog.component.scss']
})
export class OkCancelDialogComponent implements OnInit {
  @Output() ok: EventEmitter<null>
  @Output() cancel: EventEmitter<null>

  constructor(private dialogRef: MatDialogRef<OkCancelDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.ok = new EventEmitter();
      this.cancel = new EventEmitter();
    }

  ngOnInit(): void {
  }

  submit() {
    this.ok.emit();
    this.dialogRef.close();
  }

  close() {
    this.cancel.emit();
    this.dialogRef.close();
  }

}
