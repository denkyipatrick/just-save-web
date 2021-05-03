import { SimpleStockItem } from './../../models/simplestockitem';
import { StockItemTransfer } from './../../models/stockitemtransfer';
import { StaffService } from './../../services/staff.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockService } from './../../services/stock.service';
import { StockItem } from './../../models/stockitem';
import { Product } from './../../models/product';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BranchService } from './../../services/branch.service';
import { CompanyService } from './../../services/company.service';
import { Stock } from './../../models/stock';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TransferStockItemDialogComponent } from '../transfer-stock-item-dialog/transfer-stock-item-dialog.component';
import { AddStockItemDialogComponent } from '../add-stock-item-dialog/add-stock-item-dialog.component';

const SEARCH_KEY: string = 'simple-stock-items-search-key';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stock: Stock;
  stockId: string = '';
  isFetchingStock: boolean = true;

  simpleStockItems: SimpleStockItem[] = [];
  searchQuery: string = sessionStorage.getItem(SEARCH_KEY);

  tableColumns: string[] = ['key', 'name', 'quantity'];
  
  itemsDataSource: MatTableDataSource<SimpleStockItem>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private branchService: BranchService,
    private staffService: StaffService,
    private stockService: StockService,
    private dialogOpener: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {    
    // this.itemsDataSource = new MatTableDataSource(this.products);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stockId = params['id'];
    });

    this.fetchStock();
  }

  showAddItemDialog() {
    const dialogRef = this.dialogOpener.open(AddStockItemDialogComponent, {
      disableClose: false,
      data: {
        stockId: this.stock.id
      }
    });

    dialogRef.componentInstance
    .addNewProduct
    .subscribe(() => {
      this.router.navigate(['add-product'], { relativeTo: this.route });
    });
  }

  goBack() {
    this.searchQuery = '';
    sessionStorage.removeItem(SEARCH_KEY);
    window.history.back();
  }

  showRowMenu(e: Event) {
    e.stopPropagation();
  }

  showTransferItemDialog(stockItem: StockItem) {
    this.dialogOpener.open(TransferStockItemDialogComponent, {
      disableClose: true,
      data: {
        item: stockItem,
        stock: this.stock,
        staffBranchId: this.staffService.staff?.staffBranch?.branch.id,
      }
    })
    .componentInstance
    .done
    .subscribe(input => {
      const transfer = input.transfer as StockItemTransfer;

      this.stock.items.forEach(item => {
        if (item.id === transfer.sendingStockItemId) {
          item.availableQuantity -= transfer.quantity
        }
      });

      this.dialogOpener.open(OkDialogComponent, {
        data: {
          title: `Transfer Completed`,
          message: `You have successfully transferred 5 of ${stockItem.product.name} ` + 
          `to the ${input.branchName} branch.`
        }
      });
    });
  }

  closeOrder() {
    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Close Stock',
        message: 'You cannot add any items to a closed stock. Do you want to continue?',
        okButtonText: 'YES',
        cancelButtonText: 'NO'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
        disableClose: true
      });

      this.branchService.closeBranchStock(this.stock.id)
      .subscribe(stock => {
        dialogRef.close();
        this.stock.isOpened = false;

        this.dialogOpener.open(OkDialogComponent, {
          data: {
            title: 'Success',
            message: 'You have successfully closed this stock. You cannot add any more items.'
          }
        });
      }, error => {
        dialogRef.close();
        console.error(error);
      });
    });
  }
  
  viewItem(item: SimpleStockItem): void {
    const stockItem = this.stock.items.find(ssItem => ssItem.id === item.id);
    this.router.navigate(['/system/products/', stockItem.product.id], { relativeTo: this.route });
  }

  searchProduct(query: string): void {
    this.itemsDataSource.filter = query;
    sessionStorage.setItem(SEARCH_KEY, query);
  }

  clearSearchBox(inputElement: HTMLInputElement) {
    inputElement.value = '';
    this.itemsDataSource.filter = "";
    sessionStorage.removeItem(SEARCH_KEY);
  }

  deleteItem(item: StockItem, e: Event) {
    e.stopPropagation();

    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: `Remove ${item?.product?.name}?`,
        message: 'Do you want to remove this item? You cannot undo this operation.',
        okButtonText: 'REMOVE',
        cancelButtonText: 'CANCEL'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      item.isDeleting = true;

      this.stockService.removeStockItem(item.id)
      .subscribe(removedStockItem => {
        item.isDeleting = false;

        this.stock.items = this.stock.items
          .filter(stockItem => stockItem.id !== item.id);

        this.simpleStockItems = this.simpleStockItems.filter(simpleStockItem => 
          simpleStockItem.id !== item.id
        );

        this.snackBar.open("Item Removed", "CLOSE", {
          duration: 7000
        });

        this.itemsDataSource = new MatTableDataSource(this.simpleStockItems);
        this.itemsDataSource.sort = this.sort;
        this.itemsDataSource.paginator = this.paginator;
      }, error => {
        item.isDeleting = false;
        this.snackBar.open("Unable to remove item.", "OK", {
          duration: 7000
        });
      });
    });
  }

  deleteStock() {
    this.dialogOpener.open(OkCancelDialogComponent, {
      data: {
        title: 'Delete Stock',
        message: 'Are you sure about this action?',
        okButtonText: 'YES',
        cancelButtonText: 'NO'
      }
    })
    .componentInstance
    .ok
    .subscribe(() => {
      const dialogRef = this.dialogOpener.open(PleaseWaitDialogComponent, {
        disableClose: true
      });

      this.stockService.deleteStock(this.stock.id)
      .subscribe(() => {
        dialogRef.close();

        this.snackBar.open("Stock is deleted", "CLOSE", {
          duration: 7000
        });

        this.router.navigate(['..'], { relativeTo: this.route });
      }, error => {
        dialogRef.close();
        
        this.snackBar.open("Unable to delete stock.", "OK", {
          duration: 7000
        });

        switch(error.status) {
          case 400: {

          }
        }
      });
    });
  }

  fetchStock() {
    this.isFetchingStock = true;

    this.companyService.fetchStock(this.stockId)
    .subscribe(stock => {
      this.isFetchingStock = false;

      if (stock?.isOpened) {
        this.tableColumns.push('actions');
      }

      stock.dateString = new Date(stock?.createdAt).toDateString();

      this.stock = stock;
      this.stock.items.forEach(item => {
        this.simpleStockItems.push(new SimpleStockItem(
          item.id, item?.product?.name, item?.product?.lookupKey, item.quantity
          ));
      });

      this.itemsDataSource = new MatTableDataSource(this.simpleStockItems);
      this.itemsDataSource.sort = this.sort;
      this.itemsDataSource.paginator = this.paginator;

      this.itemsDataSource.filter = this.searchQuery;
    }, error => {
      this.isFetchingStock = false;

      switch(error.status) {
        case 400: {

        }
      }
    });
  }

}
