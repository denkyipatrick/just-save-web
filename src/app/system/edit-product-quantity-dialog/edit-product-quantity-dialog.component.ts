import { BranchService } from './../../services/branch.service';
import { BranchProduct } from './../../models/branchproduct';
import { Product } from './../../models/product';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-product-quantity-dialog',
  templateUrl: './edit-product-quantity-dialog.component.html',
  styleUrls: ['./edit-product-quantity-dialog.component.scss']
})
export class EditProductQuantityDialogComponent implements OnInit {
  productQuantity: number;
  branchProduct: BranchProduct;

  updatingQuantity: boolean;
  networkErrorMessage: string;
  errorUpdatingQuantity: boolean;

  @Output() done: EventEmitter<BranchProduct>;

  constructor(
    private branchService: BranchService,
    private dialogRef: MatDialogRef<EditProductQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.done = new EventEmitter();
    }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.branchProduct = this.data.branchProduct;
    this.productQuantity = this.branchProduct.quantity;
  }

  quantityTyped(value: string): void {
    this.productQuantity = +value;
  }

  incrementQuantity(): void {
    this.productQuantity++;
  }

  decrementQuantity(): void {
    this.productQuantity--;
  }

  close(): void {
    this.dialogRef.close();
  }

  updateQuantity(newQuantity: number): void {
    this.updatingQuantity = true;
    this.errorUpdatingQuantity  = false;

    this.branchService.updateBranchProductQuantity(
      this.branchProduct.branchId,
      this.branchProduct.productId,
      newQuantity
    )
    .subscribe(branchProduct => {
      this.updatingQuantity = false;

      this.done.emit(branchProduct);
      this.dialogRef.close();
    }, error => {
      this.updatingQuantity = false;
      this.errorUpdatingQuantity  = true;
    });
  }
}
