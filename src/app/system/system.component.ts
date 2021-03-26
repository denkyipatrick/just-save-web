import { Router } from '@angular/router';
import { PleaseWaitDialogComponent } from './../dialog/please-wait-dialog/please-wait-dialog.component';
import { StaffService } from './../services/staff.service';
import { UtilityService } from './../services/utility.service';
import { Component, OnInit } from '@angular/core';
import { Staff } from '../models/staff';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {
  staff: Staff;
  appName: string;
  appSlogan: string;

  isMakeOrder: boolean;
  isViewStaffs: boolean;
  canViewBranches: boolean;
  isViewProducts: boolean;
  isShowDashboard: boolean;

  constructor(
    private StaffService: StaffService, 
    private utilityService: UtilityService,
    private dialogOpener: MatDialog,
    private router: Router
    ) {
    this.staff = this.StaffService.staff;
    this.appName = this.utilityService.appName;
    this.appSlogan = this.utilityService.appSlogan;
    
    if (this.staff.roles.find(role => role.id === 'make-order')) {
      this.isMakeOrder = true;
    }

    if (this.staff.roles.find(role => role.id === 'view-dashboard')) {
      this.isShowDashboard = true;
    }
    
    if (this.staff.roles.find(role => role.id === 'view-staff')) {
      this.isViewStaffs = true;
    }
    
    if (this.staff.roles.find(role => role.id === 'view-product')) {
      this.isViewProducts = true;
    }
    
    if (this.staff.roles.find(role => role.id === 'view-branch')) {
      this.canViewBranches = true;
    }

    // Remove this if dashboard is ready
    this.isShowDashboard = false;
  }

  ngOnInit(): void {
  }

  signOut() {
    const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
      disableClose: true
    });

    setTimeout(() => {
      dialogRef.close();
      this.router.navigate(['/out']);
    }, 2000);
  }

}
