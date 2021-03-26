import { MatSnackBar } from '@angular/material/snack-bar';
import { PleaseWaitDialogComponent } from './../../../dialog/please-wait-dialog/please-wait-dialog.component';
import { Staff } from './../../../models/staff';
import { StaffService } from './../../../services/staff.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  staff: Staff;
  form: FormGroup;
  isShowNameForm: boolean;

  constructor(
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private snackBar: MatSnackBar
    ) {
    this.staff = this.staffService.staff;
    this.form = new FormGroup({
      lastName: new FormControl(),
      firstName: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  toggleShowNameForm() {
    this.isShowNameForm = !this.isShowNameForm;
  }

  changeName() {
    if (this.form.invalid) {
      return;
    }

    // const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent);

    // this.staffService.changeName(this.form.value)
    // .subscribe(staff => {
    //   this.staff.lastName = staff.lastName;
    //   this.staff.firstName = staff.firstName;
    //   this.staffService.staff.lastName = staff.lastName;
    //   this.staffService.staff.firstName = staff.firstName;
      
    //   sessionStorage.setItem('staff', JSON.stringify(this.staffService.staff));
    //   localStorage.setItem('staff', JSON.stringify(this.staffService.staff));
      
    //   dialogRef.close();
    //   this.isShowNameForm = false;
    //   // this.form.patchValue({
    //   //   firstName: '',
    //   //   lastName: ''
    //   // });
    //   this.form.reset()

    //   this.snackBar.open('Name changed', 'CLOSE', {
    //     duration: 5000
    //   });
    // }, error => {
    //   dialogRef.close();
    // });
  }

}
