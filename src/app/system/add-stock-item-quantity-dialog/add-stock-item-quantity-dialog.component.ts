import { MatSnackBar } from '@angular/material/snack-bar';
import { StockService } from './../../services/stock.service';
import { FormGroup, FormControl } from '@angular/forms';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { Product } from './../../models/product';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { StockEntryItem } from '../../models/stockentryitem';

@Component({
  selector: 'app-add-stock-item-quantity-dialog',
  templateUrl: './add-stock-item-quantity-dialog.component.html',
  styleUrls: ['./add-stock-item-quantity-dialog.component.scss']
})
export class AddStockItemQuantityDialogComponent implements OnInit {
  form: FormGroup;
  stockId: string;
  product: Product;
  isCreatingStockItem: boolean = false;
  @Output() itemCreated: EventEmitter<StockEntryItem>;

  constructor(
    private dialogRef: MatDialogRef<AddStockItemQuantityDialogComponent>,
    private stockService: StockService,
    private snackBar: MatSnackBar,
    private dialogOpener: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.form = new FormGroup({
      stockId: new FormControl(),
      quantity: new FormControl(),
      productId: new FormControl()
    });

    this.itemCreated = new EventEmitter();
  }

  ngOnInit(): void {
    this.stockId = this.data.stockId;
    this.product = this.data.product;

    this.form.patchValue({
      stockId: this.data.stockId,
      productId: this.product.id
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createStockItem() {
    if (this.form.invalid) { return; }

    // this.dialogOpener.open(OkCancelDialogComponent, {
    //   data: {
    //     title: 'Add Stock Item',
    //     message: `Are you sure you want to add ` + 
    //     `${this.form.value['quantity']} "${this.product.name}" to this stock?`,
    //     okButtonText: 'YES',
    //     cancelButtonText: 'NO'
    //   }
    // })
    // .componentInstance
    // .ok
    // .subscribe(() => {

    this.isCreatingStockItem = true;
    this.stockService.createStockItem(this.form.value)
    .subscribe(stockItem => {
      this.isCreatingStockItem = false;
      this.itemCreated.emit(stockItem);

      this.snackBar.open(`${stockItem.quantity} ${this.product.name} added.`, 'CLOSE', {
        duration: 5000
      });
      this.dialogRef.close();
    }, error => {
      this.isCreatingStockItem = false;
    });
    // });
  }

}
