import { CompanyService } from './../services/company.service';
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
    private companyService: CompanyService,
    private staffService: StaffService,
    private utilityService: UtilityService,
    private dialogOpener: MatDialog,
    private router: Router
    ) {
    this.staff = this.staffService.staff;
    this.appName = this.companyService.company.name;
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

  signOut(): void {
    const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
      disableClose: true
    });

    setTimeout(() => {
      dialogRef.close();
      // localStorage.setItem('staff', JSON.stringify(staff));
      // sessionStorage.setItem('staff', JSON.stringify(staff));
      
    // this.companyId = localStorage.getItem('companyId');
    // this.company = JSON.parse(localStorage.getItem('company'));

      localStorage.removeItem('staff');
      sessionStorage.removeItem('staff');
      sessionStorage.removeItem('stock-list');
      sessionStorage.removeItem('staffs');
      sessionStorage.removeItem('orders');
      sessionStorage.removeItem('branches');
      sessionStorage.removeItem('products');
      sessionStorage.removeItem('cart-items');
      // localStorage.removeItem('companyId');
      // localStorage.removeItem('company');
      localStorage.removeItem('branchId');
      this.router.navigate(['/out']);
    }, 2000);
  }

}
