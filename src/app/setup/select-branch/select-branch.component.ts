import { Router, ActivatedRoute } from '@angular/router';
import { StaffService } from './../../services/staff.service';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Branch } from './../../models/branch';
import { CompanyService } from './../../services/company.service';
import { Company } from './../../models/company';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-select-branch',
  templateUrl: './select-branch.component.html',
  styleUrls: ['./select-branch.component.scss']
})
export class SelectBranchComponent implements OnInit {
  company: Company;
  branches: Branch[];
  form: FormGroup;
  enableNextButton: boolean;

  constructor(
    private staffService: StaffService,
    private companyService: CompanyService,
    private dialogOpener: MatDialog,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.company = JSON.parse(localStorage.getItem('company'));
    this.form = new FormGroup({
      branchId: new FormControl()
    });
  }

  ngOnInit(): void {
    this.companyService.fetchBranches()
    .subscribe(branches => {
      this.branches = branches;
      this.enableNextButton = true;

      this.form.patchValue({
        'branchId': branches[0]?.id
      })
    }, error => {
      console.log(error);
    });
  }

  branchSelected() {
    this.staffService.branchId = this.form.value['branchId'];
    localStorage.setItem('setup-stage', 'completed');
    localStorage.setItem('branchId', this.form.value['branchId']);

    const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
      disableClose: true
    });

    const randomNumber = Math.floor(Math.random() * 10000);
    
    setTimeout(() => {
      this.router.navigate(['../done'], { relativeTo: this.route });
      dialogRef.close();
    }, randomNumber);
  }

}
