import { Role } from './../../models/role';
import { Staff } from './../../models/staff';
import { RoleGroup } from '../../models/rolegroup';
import { UtilityService } from './../../services/utility.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss']
})
export class EditRoleDialogComponent implements OnInit {
  @Output() addRole: EventEmitter<string>;
  @Output() removeRole: EventEmitter<string>;

  targetStaff: Staff;
  roleGroups: RoleGroup[];
  roleGroupNames: string[];

  roleGroupObjects: any;

  constructor(
    private utilityService: UtilityService,
    private dialogRef: MatDialogRef<EditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.roleGroups = [];
      this.addRole = new EventEmitter();
      this.removeRole = new EventEmitter();
    }

  ngOnInit(): void {
    this.targetStaff = this.data.staff;

    this.utilityService.fetchSystemRoles()
    .subscribe(roles => {
      this.roleGroupNames = roles.map(role => role.group)
        .filter((group, index, self) => self.indexOf(group) === index);

      this.roleGroupNames.forEach(group => {
        this.roleGroups.push(new RoleGroup(group, roles.filter(role => role.group === group)));
      });
    }, error => {
      console.error(error);
    });
  }

  toggleStaffRole(roleId: string, isChecked: boolean): void {
    if (isChecked) {
      this.addRole.emit(roleId);
    } else {
      const role = this.targetStaff.roles.find(role => role.id === roleId);

      console.log(role);
      this.removeRole.emit(role['NewStaffRole']['id']);
    }
  }

  doesStaffHasRole(roleId: string): boolean {
    return this.targetStaff.roles.find(role => role.id === roleId) ? true : false;
  }

  close(): void {
    this.dialogRef.close();
  }

}
