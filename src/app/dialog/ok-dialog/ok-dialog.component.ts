import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ok-dialog',
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.scss']
})
export class OkDialogComponent implements OnInit {
  @Output() ok: EventEmitter<null>;

  constructor(
    private dialogRef: MatDialogRef<OkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.ok = new EventEmitter();
    }

  ngOnInit(): void {
  }

  submit(): void {
    this.ok.emit();
    this.dialogRef.close();
  }

}
