import { Branch } from './../models/branch';
import { environment } from './../../environments/environment.prod';
import { BranchService } from './../services/branch.service';
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
    private branchService: BranchService,
    private utilityService: UtilityService,
    private dialogOpener: MatDialog,
    private router: Router) {
    this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      branchId: new FormControl(),
      companyId: new FormControl(this.companyService.company.id)
    });

    this.appName = this.utilityService.appName;
    this.appSlogan = this.utilityService.appSlogan;

    this.company = JSON.parse(localStorage.getItem('branch-setup-company'));
    this.appName = this.company?.name;
  }

  ngOnInit(): void {
    console.log(environment);
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
      let branch: Branch = null;
      this.staffService.staff = staff;
      localStorage.setItem('staff', JSON.stringify(staff));
      console.log(environment.isBranchBuild, environment.production);

      if (environment.isBranchBuild) {
        branch = JSON.parse(localStorage.getItem('setup-branch'));
        localStorage.setItem('logged-in-staff', JSON.stringify(staff));
      } else { // isOnlineBuild
        branch = staff.staffBranch.branch;
        this.staffService.branchId = staff?.staffBranch?.branch?.id;
        this.branchService.branchId = staff?.staffBranch?.branch?.id;

        localStorage.setItem('branchId', staff?.staffBranch?.branch?.id);
        sessionStorage.setItem('branchId', staff?.staffBranch?.branch?.id);
        sessionStorage.setItem('staff', JSON.stringify(staff));
      }

      localStorage.setItem('branch', JSON.stringify(branch));
      localStorage.setItem('branch-id', branch.id);

      // this.companyService.companyId = staff?.staffBranch?.branch?.company?.id;

      // localStorage.setItem('company', JSON.stringify(staff.staffBranch.branch.company));
      // localStorage.setItem('companyId', JSON.stringify(staff.staffBranch.branch.company.id));

      // localStorage.setItem('branchId', staff?.staffBranch?.branch?.id);
      // sessionStorage.setItem('branchId', staff?.staffBranch?.branch?.id);
      // localStorage.setItem('staff', JSON.stringify(staff));
      // sessionStorage.setItem('staff', JSON.stringify(staff));

      // if (environment.isBranchBuild) {
      //   localStorage.setItem('logged-in-staff', JSON.stringify(staff));
      //   this.router.navigate(['/branch']);
      // } else {
      //   localStorage.setItem('branchId', staff?.staffBranch?.branch?.id);
      //   sessionStorage.setItem('branchId', staff?.staffBranch?.branch?.id);
      //   localStorage.setItem('staff', JSON.stringify(staff));
      //   sessionStorage.setItem('staff', JSON.stringify(staff));

      //   this.router.navigate(['system/products']);
      // }

      console.log(branch);
      
      this.router.navigate([`branches/${branch.id}/products`]);

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
