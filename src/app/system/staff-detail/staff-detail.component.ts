import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { RoleGroup } from './../../models/rolegroup';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Staff } from './../../models/staff';
import { ActivatedRoute } from '@angular/router';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../edit-role-dialog/edit-role-dialog.component';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.scss']
})
export class StaffDetailComponent implements OnInit {
  form: FormGroup;
  isShowNameForm: boolean;

  targetStaff: Staff;
  loggedInStaff: Staff;
  canViewerEditName: boolean;
  doesLoggedInStaffHasEditRole: boolean;

  targetStaffRoleGroups: string[];
  usernameRouteParameter: string;
  roleGroupNames: string[];
  roleGroups: RoleGroup[];

  constructor(
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute
    ) {
      this.roleGroups = [];
      this.targetStaffRoleGroups = [];
      this.loggedInStaff = this.staffService.staff;

      this.form = new FormGroup({
        lastName: new FormControl(),
        firstName: new FormControl()
      });

      if (this.loggedInStaff.roles.find(role => role.id === 'edit-staff-role')) {
        this.doesLoggedInStaffHasEditRole = true;
      }

      if (this.loggedInStaff.roles.find(role => role.id === 'edit-staff-name')) {
        this.canViewerEditName = true;
      }
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.usernameRouteParameter = params.username;
    });

    this.fetchStaff();
  }

  toggleShowNameForm(): void {
    this.isShowNameForm = !this.isShowNameForm;
  }

  changeName(): void {
    if (this.form.invalid) {
      return;
    }

    const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent);

    this.staffService.changeName(this.targetStaff.username, this.form.value)
    .subscribe(staff => {
      this.targetStaff.lastName = staff.lastName;
      this.targetStaff.firstName = staff.firstName;

      if (this.targetStaff.username === this.staffService.staff.username) {
        this.staffService.staff.lastName = staff.lastName;
        this.staffService.staff.firstName = staff.firstName;

        sessionStorage.setItem('staff', JSON.stringify(this.staffService.staff));
        localStorage.setItem('staff', JSON.stringify(this.staffService.staff));
      }

      this.form.reset();
      this.isShowNameForm = false;

      this.snackBar.open('Name changed', 'CLOSE', {
        duration: 5000
      });

      dialogRef.close();
    }, error => {
      dialogRef.close();
    });
  }

  editRole(): void {
    const dialog = this.dialogOpener.open(EditRoleDialogComponent, {
      disableClose: true,
      data: {
        staff: this.targetStaff,
        targetStaffRoleGroups: this.targetStaffRoleGroups
      }
    })
    .componentInstance;

    dialog.addRole
    .subscribe(selectedRoleId => {
      console.log(selectedRoleId);
      this.staffService
      .addStaffRole({staffUsername: this.targetStaff.username, roleId: selectedRoleId})
      .subscribe(role => {
        this.targetStaff.roles.push(role);
        this.processStaffRoles();
        this.snackBar.open('Role Added', 'CLOSE', { duration: 5000 });

        if (this.targetStaff.username === this.staffService.staff.username) {
          this.staffService.staff.roles.push(role);
          sessionStorage.setItem('staff', JSON.stringify(this.staffService.staff));
        }

      }, error => {
        console.error(error);
        this.snackBar.open('Unable to add role.', 'CLOSE', { duration: 5000 });
      });
    });

    dialog.removeRole
    .subscribe(selectedRoleId => {
      this.staffService
      .removeStaffRole(this.targetStaff.username, selectedRoleId)
      .subscribe(deletedRole => {
        this.targetStaff.roles = this.targetStaff.roles
          .filter(role => role.id !== deletedRole.id);

        this.processStaffRoles();
        this.snackBar.open('Role Removed', 'CLOSE', { duration: 5000 });

        if (this.targetStaff.username === this.staffService.staff.username) {
          this.staffService.staff.roles = this.targetStaff.roles;
          sessionStorage.setItem('staff', JSON.stringify(this.staffService.staff));
        }

      }, error => {
        this.snackBar.open('Unable to remove role.', 'CLOSE', { duration: 5000 });
      });
    });
  }

  processStaffRoles(): void {
    this.targetStaffRoleGroups = this.targetStaff.roles.map(role => role.group)
    .filter((group, index, self) => self.indexOf(group) === index);

    this.roleGroupNames = this.targetStaff.roles.map(role => role.group)
    .filter((group, index, self) => self.indexOf(group) === index);

    this.roleGroups = [];
    this.roleGroupNames.forEach(group => {
      this.roleGroups.push(new RoleGroup(group, this.targetStaff.roles.filter(role => role.group === group)));
    });
  }

  fetchStaff(): void {
    this.staffService.fetchStaff(this.usernameRouteParameter)
    .subscribe(staff => {
      this.targetStaff = staff;
      this.processStaffRoles();

      // this.targetStaffRoleGroups = this.targetStaff.roles.map(role => role.group)
      //   .filter((group, index, self) => self.indexOf(group) === index);

      // this.roleGroupNames = this.targetStaff.roles.map(role => role.group)
      // .filter((group, index, self) => self.indexOf(group) === index);

      // this.roleGroupNames.forEach(group => {
      //   this.roleGroups.push(new RoleGroup(group, this.targetStaff.roles.filter(role => role.group == group)));
      // });
    }, error => {
      console.error(error);
    });
  }

}
