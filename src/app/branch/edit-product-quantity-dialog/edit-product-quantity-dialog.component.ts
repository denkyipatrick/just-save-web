import { BranchService } from './../services/branch.service';
import { Product } from './../models/product';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-product-quantity-dialog',
  templateUrl: './edit-product-quantity-dialog.component.html',
  styleUrls: ['./edit-product-quantity-dialog.component.scss']
})
export class EditProductQuantityDialogComponent implements OnInit {
  // stockItem: StockItem;
  product: Product;
  editType: string;
  quantityForm: FormGroup;
  isWorking: boolean;
  errorMessage: string;
  validationErrorMessages: string[] = [];
  @Output() updated: EventEmitter<Product>;

  constructor(
    private dialogRef: MatDialogRef<EditProductQuantityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private branchService: BranchService,
  ) {
    this.updated = new EventEmitter();
    this.quantityForm = new FormGroup({
      quantity: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.editType = 'Add';
    this.product = this.data?.product;
  }

  close() {
    this.dialogRef.close();
  }

  changeQuantity() {
    if (this.quantityForm.invalid) {
      return;
    }

    this.isWorking = true;
    this.errorMessage = '';

    this.branchService.changeProductQuantity(
      this.product.id,
      this.quantityForm.value.quantity,
      this.editType
    ).subscribe(product => {
      this.isWorking = false;

      this.updated.emit(product);
      this.dialogRef.close();
    }, error => {
      this.isWorking = false;

      switch(error.status) {
        case 0: {
          this.errorMessage = "You may be offline.";
          break;
        }
        case 400: {
          this.errorMessage = "Validation Errors";
          this.validationErrorMessages = error.error.errors.map(err => err.msg);
          break;
        }
        default: {
          this.errorMessage = "An unknown error has occurred. Try again later.";
        }
      }
    });
  }

}
