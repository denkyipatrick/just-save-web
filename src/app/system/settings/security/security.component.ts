import { OkDialogComponent } from './../../../dialog/ok-dialog/ok-dialog.component';
import { OkCancelDialogComponent } from './../../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { StaffService } from './../../../services/staff.service';
import { PleaseWaitDialogComponent } from './../../../dialog/please-wait-dialog/please-wait-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  form: FormGroup;

  constructor(private staffService: StaffService, private dialogOpener: MatDialog) {
    this.form = new FormGroup({
      newPassword: new FormControl(),
      currentPassword: new FormControl(),
      confirmedPassword: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  changePassword(): void {
    if (this.form.invalid) {
      return;
    }

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Change Your Password',
        message: 'Do you want to change your password? You can always update your password.'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
        disableClose: true
      });

      this.staffService.changePassword(this.staffService.staff.username, this.form.value)
      .subscribe(staff => {
        dialogRef.close();

        this.dialogOpener.open(OkDialogComponent, {
          data: {
            title: 'Successful',
            message: 'Your password is successfully changed.'
          }
        });
      }, error => {
        dialogRef.close();
        console.error(error);
      });
    });
  }

}
