import { BranchProduct } from './../../models/branchproduct';
import { BranchService } from './../services/branch.service';
import { CompanyService } from './../../services/company.service';
import { AddStockItemQuantityDialogComponent } from './../add-stock-item-quantity-dialog/add-stock-item-quantity-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from './../../models/product';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { StockEntryItem } from '../../models/stockentryitem';

@Component({
  selector: 'app-add-stock-item-dialog',
  templateUrl: './add-stock-item-dialog.component.html',
  styleUrls: ['./add-stock-item-dialog.component.scss']
})
export class AddStockItemDialogComponent implements OnInit {
  @Output() closed: EventEmitter<null>;
  @Output() itemAdded: EventEmitter<StockEntryItem>;
  @Output() addNewProduct: EventEmitter<null>;

  stockId: string;
  products: Product[];
  dataSource: MatTableDataSource<Product>;
  tableColumns: string[] = ['name', 'unitPrice'];

  isRefreshing: boolean;
  isFetchingProducts: boolean;
  isErrorFetchingProducts: boolean;

  constructor(
    private companyService: CompanyService,
    private branchService: BranchService,
    private dialogRef: MatDialogRef<AddStockItemDialogComponent>,
    private dialogOpener: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.closed = new EventEmitter();
    this.itemAdded = new EventEmitter();
    this.addNewProduct = new EventEmitter();
    // this.products = JSON.parse(sessionStorage.getItem('add-stock-item-dialog-products'));
    // this.dataSource = new MatTableDataSource(this.branchProducts);
  }

  ngOnInit(): void {
    this.stockId = this.data.stockId;

    // if(!this.branchProducts) {
    //   return this.refreshProducts();
    // }

    this.fetchCompanyProducts();
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

  refreshProducts() {
    this.isRefreshing = true;
    this.fetchCompanyProducts();
  }
  
  fetchCompanyProducts(): void {
    if (!this.isRefreshing) {
      this.isFetchingProducts = true;
    }

    this.isErrorFetchingProducts = false;

    this.branchService.fetchCompanyProducts()
    .subscribe(products => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;

      this.products = products;
      this.dataSource = new MatTableDataSource(this.products);
      // sessionStorage.setItem('add-stock-item-dialog-products',
      //   JSON.stringify(products));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;
      this.isErrorFetchingProducts = true;
    });
  }

}
