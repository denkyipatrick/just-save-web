import { CompanyService } from './../../services/company.service';
import { Branch } from './../../models/branch';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  branches: Branch[];
  fetchBranchesFromNetwork = true;

  tableColumns: string[] = ['name', 'address'];

  constructor(private companyService: CompanyService) {
    this.branches = JSON.parse(sessionStorage.getItem('branches')) || []
  }

  ngOnInit(): void {
    // if (!this.branches?.length) {
    // }
    
    this.fetchBranches();
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
