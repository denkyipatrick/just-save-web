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

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    if (this.fetchBranchesFromNetwork) {
      this.companyService.fetchBranches()
      .subscribe(branches => {
        this.branches = branches;
      }, error => {
        console.log(error);
      });
    }
  }

}
