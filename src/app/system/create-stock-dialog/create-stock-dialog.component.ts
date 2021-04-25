import { FormGroup, FormControl } from '@angular/forms';
import { Branch } from './../../models/branch';
import { CompanyService } from './../../services/company.service';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { StaffService } from './../../services/staff.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Stock } from 'src/app/models/stock';

@Component({
  selector: 'app-create-stock-dialog',
  templateUrl: './create-stock-dialog.component.html',
  styleUrls: ['./create-stock-dialog.component.scss']
})
export class CreateStockDialogComponent implements OnInit {
  @Output() stockCreated: EventEmitter<Stock>;

  disabledBranchSelect: boolean;

  form: FormGroup;
  branches: Branch[];
  isCreating: boolean = false;
  isErrorCreating: boolean = false;

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private dialogRef: MatDialogRef<CreateStockDialogComponent>
  ) {
      this.dialogRef.disableClose = true;
      this.stockCreated = new EventEmitter();
      this.branches = JSON.parse(sessionStorage.getItem('branches'));

      this.form = new FormGroup({
        branchId: new FormControl({
          value: this.staffService.staff?.staffBranch?.branch?.id,
          disabled: this.staffService.staff?.staffBranch?.branch?.id ? true : false
        })
      });
  }

  ngOnInit(): void {
    this.disabledBranchSelect = true;
    if (!this.branches) {
      this.fetchBranches();
    }
  }

  close() {
    this.dialogRef.close();
  }

  fetchBranches() {
    this.disabledBranchSelect = false;
    this.companyService.fetchBranches()
    .subscribe(branches => {
      this.branches = branches;
    }, error => {
    });
  }

  createStock() {
      this.isCreating = true;
      
      this.staffService.createBranchStock({
        companyId: this.companyService.company.id,
        branchId: this.staffService.staff.staffBranch.branch.id
      })
      .subscribe(stock => {
        this.isCreating = false;
        this.stockCreated.emit(stock);
        this.dialogRef.close();
      }, error => {
        this.isCreating = false;

        switch(error.status) {
          case 400: {
            for (const validationError of error.error.errors) {
              if (validationError.param === 'stock_opened') {
                this.dialogOpener.open(OkDialogComponent, {
                  disableClose: true,
                  data: {
                    title: 'Close Opened Stock!',
                    message: 'You already have an opened stock. Please close it first.'
                  }
                })
                .componentInstance
                .ok
                .subscribe(() => {
                  this.dialogRef.close();
                });
              }
            }
            break;
          }
          case 500: {
            this.dialogOpener.open(OkCancelDialogComponent, {
              data: {
                title: 'Unexpected Error',
                message: 'An unexpected error has occurred. Please try again later.',
                okButtonText: 'TRY AGAIN',
                cancelButtonText: 'CLOSE'
              }
            })
            .componentInstance
            .ok
            .subscribe(() => {
              this.createStock();
            })
            break;
          }
        }
      });
    // });
  }

}
