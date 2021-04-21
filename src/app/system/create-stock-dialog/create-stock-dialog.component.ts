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

  isCreating: boolean = false;
  isErrorCreating: boolean = false;

  constructor(
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private dialogRef: MatDialogRef<CreateStockDialogComponent>
    ) {
      this.dialogRef.disableClose = true;
      this.stockCreated = new EventEmitter();
    }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  createStock() {
    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: "Create Branch Stock?",
        message: "Are you sure you want to create a new stock?",
        okButtonText: 'YES',
        cancelButtonText: 'NO'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      this.isCreating = true;
      
      this.staffService.createBranchStock({
        branchId: this.staffService.staff.staffBranch.branch.id
      })
      .subscribe(stock => {
        this.isCreating = false;
        this.stockCreated.emit(stock);
        this.dialogRef.close();
      }, error => {
        this.isCreating = false;
        console.error(error);

        switch(error.status) {
          case 400: {
            for (const validationError of error.error.errors) {
              if (validationError.param === 'stock_opened') {
                this.dialogOpener.open(OkDialogComponent, {
                  data: {
                    title: 'Close Opened Stock!',
                    message: 'You already have an opened stock. Please close it first.'
                  }
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
    });
  }

}
