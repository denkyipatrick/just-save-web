import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-three-button-dialog',
  templateUrl: './three-button-dialog.component.html',
  styleUrls: ['./three-button-dialog.component.scss']
})
export class ThreeButtonDialogComponent implements OnInit {
  @Output() option1: EventEmitter<any>;
  @Output() option2: EventEmitter<any>;
  @Output() option3: EventEmitter<any>;

  constructor(
    private dialogRef: MatDialogRef<ThreeButtonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.option1 = new EventEmitter();
    this.option2 = new EventEmitter();
    this.option3 = new EventEmitter();
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
  }

  callOption1() {
    this.option1.emit();
    this.close();
  }

  callOption2() {
    this.option2.emit();
    this.close();
  }

  callOption3() {
    this.option3.emit();
    this.close();
  }

}
