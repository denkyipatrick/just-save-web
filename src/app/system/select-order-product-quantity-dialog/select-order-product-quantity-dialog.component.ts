import { FormGroup, FormControl } from '@angular/forms';
import { BranchProduct } from './../../models/branchproduct';
import { StaffService } from './../../services/staff.service';
import { CartItem } from './../../models/cartitem';
import { Product } from './../../models/product';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-order-product-quantity-dialog',
  templateUrl: './select-order-product-quantity-dialog.component.html',
  styleUrls: ['./select-order-product-quantity-dialog.component.scss']
})
export class SelectOrderProductQuantityDialogComponent implements OnInit {
  form: FormGroup;
  formErrorMessage: string;
  
  product: Product;
  branchProduct: BranchProduct;
  selectedProductBranch: BranchProduct;
  productBranches: BranchProduct[];

  quantitySelectNumber: number[];
  selectedQuantityNumber: number;
  @Output() close: EventEmitter<null>;
  @Output() accept: EventEmitter<CartItem>;

  constructor(
    private dialogRef: MatDialogRef<SelectOrderProductQuantityDialogComponent>,
    private staffService: StaffService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.close = new EventEmitter();
      this.accept = new EventEmitter();
    }

  ngOnInit(): void {
    this.product = this.data?.product;
    this.branchProduct = this.data.branchProduct;

    const staffBranchId = this.staffService.staff.staffBranch.branch.id;

    this.form = new FormGroup({
      quantity: new FormControl(),
      priceSold: new FormControl(this.branchProduct.product.sellingPrice),
      selectedBranchId: new FormControl(
        this.branchProduct?.branch.id
      )
    });

    this.quantitySelectNumber = [1, 2, 3, 4, 5];
    this.selectedQuantityNumber = this.quantitySelectNumber[0];
  }

  closeDialog() {
    this.dialogRef.close();
  }

  quantityChanged(newQuantity: number) {
    this.selectedQuantityNumber = newQuantity;
  }

  addProduct() {
    if (this.form.invalid) { return; }

    const typedQuantity = this.form.value['quantity'];

    if (typedQuantity > this.branchProduct.quantity) {
      this.formErrorMessage = `${this.branchProduct?.branch.name} ` + 
      `branch does not have ${typedQuantity} of this product. ` + 
      `This branch only has ${this.branchProduct.quantity}. ` +
      `Try other branches or reduce the quantity.`;
      return;
    }

    // const branchProduct = new BranchProduct(
    //   this.selectedProductBranch.branch.id,
    //   this.product.id, this.selectedProductBranch.quantity
    // );

    const productQuantity = null;
    this.branchProduct.product.quantity = null;

    // branchProduct.product = new Product(
    //   this.product.id, 
    //   this.product.name, 
    //   this.product.lookupKey,
    //   productQuantity,
    //   this.product.unitPrice,
    //   this.product.costPrice,
    //   this.product.sellingPrice
    // );
    
    this.accept.emit(
      new CartItem(this.form.value['quantity'], this.form.value['priceSold'], this.branchProduct)
    );

    this.dialogRef.close();
  }

}
