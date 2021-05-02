import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { StaffService } from './../../services/staff.service';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { BranchService } from './../../services/branch.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CompanyService } from './../../services/company.service';
import { Branch } from './../../models/branch';
import { StockItem } from './../../models/stockitem';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';

@Component({
  selector: 'app-transfer-stock-item-dialog',
  templateUrl: './transfer-stock-item-dialog.component.html',
  styleUrls: ['./transfer-stock-item-dialog.component.scss']
})
export class TransferStockItemDialogComponent implements OnInit {
  item: StockItem;
  branches: Branch[];
  staffBranchId: string;
  isFetchingBranches: boolean = false;
  @Output() done: EventEmitter<any>;

  transferForm: FormGroup;
  isTransferring: boolean = false;
  transferErrorMessage: string = '';

  constructor(
    private dialogRef: MatDialogRef<TransferStockItemDialogComponent>,
    private companyService: CompanyService,
    private branchService: BranchService,
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.done = new EventEmitter();
      this.branches = JSON.parse(sessionStorage.getItem('branches'));

      this.transferForm = new FormGroup({
        senderId: new FormControl(this.staffService.staff.id),
        receivingBranchId: new FormControl(),
        quantity: new FormControl(),
      });
    }

  ngOnInit(): void {
    this.item = this.data.item;
    this.staffBranchId = this.data.staffBranchId;
    this.branches = this.branches?.filter(branch => branch.id !== this.staffBranchId);

    if (!this.branches) {
      return this.fetchBranches();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  fetchBranches() {
    this.isFetchingBranches = true;

    this.companyService.fetchBranches()
    .subscribe(branches => {
      this.isFetchingBranches = false;
      this.branches = branches.filter(branch => branch.id !== this.staffBranchId);
      
      sessionStorage.setItem('branches', JSON.stringify(branches));
    }, error => {
      this.isFetchingBranches = false;
    });
  }

  transferItem() {
    if (this.transferForm.invalid) { return; }

    if (this.transferForm.value['quantity'] > this.item.availableQuantity) {
      this.dialogOpener.open(OkDialogComponent, {
        data: {
          title: 'Insufficient Quantity',
          message: 'Quantity available is not enough for this transfer. ' +
          'Please reduce the quantity you are sending.'
        }
      })
      return;
    }

    const selectedBranch = this.branches.find(branch => branch.id ===
      this.transferForm.value['receivingBranchId']);

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Transfer Item?',
        message: `Do you want to transfer ${this.transferForm.value['quantity']} ` + 
        `of ${this.item.product.name} to ${selectedBranch.name} branch?`
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      this.isTransferring = true;
      this.transferErrorMessage = '';

      this.branchService.transferBranchItem(this.item.id, this.transferForm.value)
      .subscribe(stockItemTransfer => {
        this.isTransferring = false;
        this.done.emit({transfer: stockItemTransfer, branchName: selectedBranch.name});
        this.dialogRef.close();
      }, error => {
        this.isTransferring = false;
        alert('error');
        console.error(error);
      });
    });
  }
}
