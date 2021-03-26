import { Staff } from './../../models/staff';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  staffList: Staff[];
  viewerHasEditStaffRole: boolean;
  viewerHasDeleteStaffRole: boolean;

  constructor(private StaffService: StaffService) {
    if (this.StaffService.staff.roles.find(role => role.id === 'edit-staff')) {
      this.viewerHasEditStaffRole = true;
    }

    if (this.StaffService.staff.roles.find(role => role.id === 'delete-staff')) {
      this.viewerHasDeleteStaffRole = true;
    }
  }

  ngOnInit(): void {
    this.fetchStaff();
  }

  fetchStaff() {
    this.StaffService.fetchAllStaff()
    .subscribe(staffList => {
      console.log(staffList);
      this.staffList = staffList;
    }, error => {
      console.log(error);
    });
  }

}
