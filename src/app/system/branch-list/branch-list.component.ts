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
  @Input() fetchBranchesFromNetwork: boolean = true;

  constructor(private utilityService: UtilityService) { }

  ngOnInit(): void {
    if (this.fetchBranchesFromNetwork) {
      this.utilityService.fetchBranches()
      .subscribe(branches => {
        console.log(branches);
        this.branches = branches;
      }, error => {
        console.log(error);
      });
    }
  }

}
