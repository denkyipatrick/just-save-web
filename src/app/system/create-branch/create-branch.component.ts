import { CompanyService } from './../../services/company.service';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { Branch } from './../../models/branch';
import { StaffService } from './../../services/staff.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})
export class CreateBranchComponent implements OnInit {
  form: FormGroup;
  createdBranches: Branch[];
  isCreatingBranch: boolean;
  isErrorCreatingBranch: boolean;

  constructor(private staffService: StaffService, 
    private companyService: CompanyService,
    private dialogOpener: MatDialog,
    private snackBar: MatSnackBar
    ) {
    this.form = new FormGroup({
      name: new FormControl(),
      address: new FormControl(),
      companyId: new FormControl(this.companyService.companyId)
    });

    this.createdBranches = [];
  }

  ngOnInit(): void {
  }

  createBranch() {
    if (this.form.invalid) {
      return;
    }

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: "Create New Branch",
        message: "Are you sure you want to add this branch?"
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
        disableClose: true
      });
        
      this.staffService.createBranch(this.form.value)
        .subscribe(branch => {
          dialogRef.close();
          this.createdBranches.push(branch);
          this.dialogOpener.open(OkDialogComponent, {
            data: {
              title: "Branch Created",
              message: "You have successfully created a new branch.",
              okButtonText: 'OK'
            }
          });
          
        }, error => {
          console.error(error);
          dialogRef.close();
  
          switch(error.status) {
            case 0: {
              this.dialogOpener.open(OkDialogComponent, {
                data: {
                  title: "You are offline",
                  message: "Check your network and try again."
                }
              });
              break;
            }
            case 500: {
              this.snackBar.open("An Error Occurred.", "TRY AGAIN")
              .onAction()
              .subscribe(() => {
                this.createBranch();
              })
              break;
            }
          }
        });
    });
  }

}
