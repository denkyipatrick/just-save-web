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

  staffList: Staff[];
  viewerHasEditStaffRole: boolean;
  viewerHasDeleteStaffRole: boolean;

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService
  ) {
    if (this.staffService.staff.roles.find(role => role.id === 'edit-staff')) {
      this.viewerHasEditStaffRole = true;
    }

    if (this.staffService.staff.roles.find(role => role.id === 'delete-staff')) {
      this.viewerHasDeleteStaffRole = true;
    }

    if (this.staffService.staff.username === 'root') {
      this.isAdmin;
      this.viewerHasEditStaffRole = true;
      this.viewerHasDeleteStaffRole = true;
    }
  }

  ngOnInit(): void {
    if (this.staffService.staff.username === 'root') {
      this.fetchCompanyStaffs()
    } else {
      this.fetchStaff();
    }
  }

  fetchStaff(): void {
    this.staffService.fetchAllStaff()
    .subscribe(staffList => {
      console.log(staffList);
      this.staffList = staffList;
    }, error => {
      console.log(error);
    });
  }

  fetchCompanyStaffs() {
    this.companyService.fetchStaffs()
    .subscribe(staffs => {
      this.staffList = staffs;
    }, error => {
      console.error(error);
    });
  }

}
