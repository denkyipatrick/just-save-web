import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { SetupService } from './../services/setup.service';
import { Branch } from './../../models/branch';
import { Company } from './../../models/company';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-choose-branch',
  templateUrl: './choose-branch.component.html',
  styleUrls: ['./choose-branch.component.scss']
})
export class ChooseBranchComponent implements OnInit {
  company: Company;
  branches: Branch[];
  form: FormGroup;
  enableNextButton: boolean;

  constructor(
    private setupService: SetupService,
    private router: Router,
    private route: ActivatedRoute
    ) {
    this.company = JSON.parse(localStorage.getItem('branch-setup-company'));
    this.form = new FormGroup({
      branchId: new FormControl()
    });
  }

  ngOnInit(): void {
    this.setupService.fetchCompanyBranches()
    .subscribe(branches => {
      this.branches = branches;
      this.enableNextButton = true;

      this.form.patchValue({
        branchId: branches[0]?.id
      });
    }, error => {
      console.log(error);
    });
  }

  branchSelected(): void {
    localStorage.setItem('setup-stage', 'completed');
    localStorage.setItem('branchId', this.form.value.branchId);

    const selectedBranch = this.branches.find(
      branch => branch.id === this.form.value.branchId
    );

    localStorage.setItem('setup-branch', JSON.stringify(selectedBranch))
    this.router.navigate(['../done'], { relativeTo: this.route });
  }


}
