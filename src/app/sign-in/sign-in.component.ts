import { Company } from './../models/company';
import { CompanyService } from './../services/company.service';
import { UtilityService } from './../services/utility.service';
import { PleaseWaitDialogComponent } from './../dialog/please-wait-dialog/please-wait-dialog.component';
import { StaffService } from './../services/staff.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  company: Company;

  form: FormGroup;
  appName: string;
  appSlogan: string;
  isSignIn: boolean;
  isSignInError: boolean;
  networkErrorMessage: string;

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private utilityService: UtilityService,
    private dialogOpener: MatDialog,
    private router: Router) {
    this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      branchId: new FormControl()
    });

    this.appName = this.utilityService.appName;
    this.appSlogan = this.utilityService.appSlogan;

    this.company = JSON.parse(localStorage.getItem('company'));
    this.appName = this.company?.name;
  }

  ngOnInit(): void {
  }

  signIn(): void {
    if (this.form.invalid) {
      return;
    }

    this.form.patchValue({ branchId: this.staffService.branchId });

    this.isSignInError = false;
    const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
      disableClose: true
    });

    this.staffService.signIn(this.form.value)
    .subscribe(staff => {
      console.log(staff);

      this.staffService.staff = staff;
      this.staffService.branchId = staff.branch.id;
      this.companyService.companyId = staff.branch.company.id;

      // localStorage.setItem('branchId', JSON.stringify(staff.branch.id));
      // localStorage.setItem('companyId', JSON.stringify(staff.branch.company.id));

      sessionStorage.setItem('staff', JSON.stringify(staff));
      this.router.navigate(['system/products']);
      dialogRef.close();
    }, error => {
      dialogRef.close();
      this.isSignInError = true;

      switch (error.status) {
        case 0: {
          this.networkErrorMessage = 'Please check your internet connection.';
          break;
        }
        case 404: {
          this.networkErrorMessage = 'Username or password is not correct.';
          break;
        }
        case 500: {
          this.networkErrorMessage = 'An unexpected error has occurred. Please try again later.';
        }
      }
    });

  }

}
