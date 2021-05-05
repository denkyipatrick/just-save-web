import { AddStockItemQuantityDialogComponent } from './../add-stock-item-quantity-dialog/add-stock-item-quantity-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from './../../models/product';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { StockItem } from '../../models/stockitem';

@Component({
  selector: 'app-add-stock-item-dialog',
  templateUrl: './add-stock-item-dialog.component.html',
  styleUrls: ['./add-stock-item-dialog.component.scss']
})
export class AddStockItemDialogComponent implements OnInit {
  @Output() closed: EventEmitter<null>;
  @Output() itemAdded: EventEmitter<StockItem>;
  @Output() addNewProduct: EventEmitter<null>;

  stockId: string;
  products: Product[];
  dataSource: MatTableDataSource<Product>;
  tableColumns: string[] = ['key', 'name', 'unitPrice'];

  constructor(
    private dialogRef: MatDialogRef<AddStockItemDialogComponent>,
    private dialogOpener: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.closed = new EventEmitter();
    this.itemAdded = new EventEmitter();
    this.addNewProduct = new EventEmitter();
    this.products = JSON.parse(sessionStorage.getItem('products'));
    this.dataSource = new MatTableDataSource(this.products);
  }

  ngOnInit(): void {
    this.stockId = this.data.stockId;
  }

  closeDialog() {
    this.closed.emit();
    this.dialogRef.close();
  }

  searchProduct(query: string) {
    this.dataSource.filter = query;
  }

  clearSearchBox(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.dataSource.filter = '';
  }

  addProduct() {
    this.addNewProduct.emit();
    this.dialogRef.close();
  }

  selectProduct(product: Product) {
    const dialogRef = this.dialogOpener.open(AddStockItemQuantityDialogComponent, {
      data: {
        product: product,
        stockId: this.stockId
      }
    });

    dialogRef.componentInstance
    .itemCreated
    .subscribe(stockItem => {
      this.itemAdded.emit(stockItem);
    });
  }

}
