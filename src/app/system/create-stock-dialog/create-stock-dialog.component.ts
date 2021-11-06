import { BranchService } from './../services/branch.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Branch } from './../../models/branch';
import { CompanyService } from './../../services/company.service';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { StaffService } from './../../services/staff.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StockEntry } from 'src/app/models/stockentry';

@Component({
  selector: 'app-create-stock-dialog',
  templateUrl: './create-stock-dialog.component.html',
  styleUrls: ['./create-stock-dialog.component.scss']
})
export class CreateStockDialogComponent implements OnInit {
  @Output() stockCreated: EventEmitter<StockEntry>;

  branch: Branch = JSON.parse(localStorage.getItem('branch'));
  disabledBranchSelect: boolean;

  form: FormGroup;
  branches: Branch[];
  isCreating: boolean = false;
  isErrorCreating: boolean = false;

  constructor(
    private branchService: BranchService,
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private dialogRef: MatDialogRef<CreateStockDialogComponent>
  ) {
    this.dialogRef.disableClose = true;
    this.stockCreated = new EventEmitter();

    this.form = new FormGroup({
      branchId: new FormControl(this.branch.id)
    });
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  createStock() {
    if (this.form.invalid) { return; }

    console.log(this.form.value);

    this.isCreating = true;

    this.branchService.createStockEntry(this.form.value)
    .subscribe(stockEntry => {
      this.isCreating = false;
      this.stockCreated.emit(stockEntry);
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
                  title: 'Close Opened Stock Entry!',
                  message: 'You already have an opened stock entry. Please close it first.'
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
