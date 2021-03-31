import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { Branch } from './../../models/branch';
import { CompanyService } from './../../services/company.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { StaffService } from './../../services/staff.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Staff } from 'src/app/models/staff';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {
  form: FormGroup;
  branches: Branch[];
  isCreatingStaff: boolean;
  isErrorCreatingStaff: boolean;

  constructor(
    private staffService: StaffService,
    private companyService: CompanyService,
    private dialogOpener: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) {
    this.form = new FormGroup({
      branchId: new FormControl(this.staffService.branchId),
      username: new FormControl(),
      password: new FormControl(),
      lastName: new FormControl(),
      firstName: new FormControl()
    });
  }

  ngOnInit(): void {
    this.fetchBranches();
  }

  fetchBranches(): void {
    this.companyService.fetchBranches()
    .subscribe(branches => {
      console.log(branches);
      this.branches = branches;
    }, error => {
      console.log(error);
    });
  }

  createStaff(): void {
    if (this.form.invalid) {
      return;
    }

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Create Staff',
        message: `Are you sure you want to add ${this.form.value.firstName} as a staff?`
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      // this.isCreatingStaff = true;
      // this.isErrorCreatingStaff = false;

      const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
        disableClose: true
      });

      this.staffService.createStaff(this.form.value)
      .subscribe(staff => {
        dialogRef.close();

        this.dialogOpener.open(OkDialogComponent, {
          disableClose: true,
          data: {
            title: `${staff?.firstName} is Added`,
            message: `You have successfully added ` +
            `${staff?.firstName} ${staff?.lastName} to your staff list. ` +
            `You can add more features to ${staff?.firstName}'s account on the next page.`,
            okButtonText: 'CONTINUE'
          }
        })
        .componentInstance
        .ok.subscribe(() => {
          this.router.navigate([`../staff`, staff.username],
          { relativeTo: this.activatedRoute });
        });

      }, error => {
        dialogRef.close();

        console.error(error);
        switch (error.status) {

        }
      });
    });
  }

}
