import { CompanyService } from './../../services/company.service';
import { Branch } from './../../models/branch';
import { UtilityService } from './../../services/utility.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {
  @Input() branches: Branch[];
  @Input() fetchBranchesFromNetwork = true;

  constructor(private companyService: CompanyService) {
    this.branches = JSON.parse(sessionStorage.getItem('branches')) || []
  }

  ngOnInit(): void {
    if (!this.branches?.length) {
      this.fetchBranches();
    }
  }

  fetchBranches() {
    this.companyService.fetchBranches()
    .subscribe(branches => {
      this.branches = branches;
      sessionStorage.setItem('branches', JSON.stringify(branches));
    }, error => {
      console.log(error);
    });
  }

}
