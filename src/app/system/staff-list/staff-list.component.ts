import { BranchService } from './../services/branch.service';
import { CompanyService } from './../../services/company.service';
import { Staff } from './../../models/staff';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  isAdmin: boolean = false;

  branchBuildStaffs: Staff[];
  staffList: Staff[] = [];
  viewerHasEditStaffRole: boolean;
  viewerHasDeleteStaffRole: boolean;

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private branchService: BranchService
  ) {
    this.staffList = JSON.parse(sessionStorage.getItem('staffs'));

    // if (this.staffService.staff.roles.find(role => role.id === 'edit-staff')) {
    //   this.viewerHasEditStaffRole = true;
    // }

    // if (this.staffService.staff.roles.find(role => role.id === 'delete-staff')) {
    //   this.viewerHasDeleteStaffRole = true;
    // }

    // if (this.staffService.staff.isAdmin) {
    //   this.isAdmin;
    //   this.viewerHasEditStaffRole = true;
    //   this.viewerHasDeleteStaffRole = true;
    // }
  }

  ngOnInit(): void {
    this.fetchStaffs();
    // if(!this.staffList?.length) {
      // if (this.staffService.staff.isAdmin) {
      //   this.fetchCompanyStaffs()
      // } else {
      // }
    // }
  }

  fetchStaffs(): void {
    this.branchService.fetchStaffs()
    .subscribe(staffList => {
      console.log(staffList);
      this.staffList = staffList;
      sessionStorage.setItem('staffs', JSON.stringify(staffList));
    }, error => {
      console.log(error);
      switch(error.status) {

      }
    });
  }

  // fetchCompanyStaffs() {
  //   this.companyService.fetchStaffs()
  //   .subscribe(staffList => {
  //     this.staffList = staffList;
  //     sessionStorage.setItem('staffs', JSON.stringify(staffList));
  //   }, error => {
  //     console.error(error);
  //   });
  // }

}
