import { CompanyService } from './../../services/company.service';
import { BranchService } from './../../services/branch.service';
import { StaffService } from './../../services/staff.service';
import { StockService } from './../../services/stock.service';
import { AddStockItemDialogComponent } from './../add-stock-item-dialog/add-stock-item-dialog.component';
import { TransferStockItemDialogComponent } from './../transfer-stock-item-dialog/transfer-stock-item-dialog.component';
import { StockItemTransfer } from './../../models/stockitemtransfer';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { SimpleStockEntryItem } from '../../models/simplestockentryitem';
import { StockEntryItem } from './../../models/stockentryitem';
import { StockEntry } from './../../models/stockentry';
import { OkCancelDialogComponent } from './../../dialog/ok-cancel-dialog/ok-cancel-dialog.component';
import { PleaseWaitDialogComponent } from './../../dialog/please-wait-dialog/please-wait-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

const SEARCH_KEY: string = 'simple-stock-items-search-key';

@Component({
  selector: 'app-stock-entry-detail',
  templateUrl: './stock-entry-detail.component.html',
  styleUrls: ['./stock-entry-detail.component.scss']
})
export class StockEntryDetailComponent implements OnInit {
  stockEntry: StockEntry;
  stockEntryId: string = '';
  isFetchingStockEntry: boolean = false;

  simpleStockItems: SimpleStockEntryItem[] = [];
  searchQuery: string = sessionStorage.getItem(SEARCH_KEY);

  tableColumns: string[] = ['key', 'name', 'quantity'];
  
  itemsDataSource: MatTableDataSource<SimpleStockEntryItem>;
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
    this.stockEntry = JSON.parse(sessionStorage.getItem('target-stock-entry'));
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.stockEntryId = params['id'];

      if (this.stockEntry) {
        this.setupStockItemsTable();
        return this.isFetchingStockEntry = false;
      }
      
      this.fetchStock();
    });
  }

  setupStockItemsTable() {
    if (this.stockEntry?.isOpened) {
      this.tableColumns.push('actions');
    }

    this.stockEntry.items.forEach(item => {
      this.simpleStockItems.push(new SimpleStockEntryItem(
        item.id, item?.product?.name, item?.product?.lookupKey, item.quantity
      ));
    });

    this.itemsDataSource = new MatTableDataSource(this.simpleStockItems);
    this.itemsDataSource.sort = this.sort;
    this.itemsDataSource.paginator = this.paginator;
    this.itemsDataSource.filter = this.searchQuery;
  }

  showAddItemDialog() {
    const dialogRef = this.dialogOpener.open(AddStockItemDialogComponent, {
      disableClose: false,
      data: {
        stockId: this.stockEntry.id
      }
    });

    dialogRef.componentInstance
    .addNewProduct
    .subscribe(() => {
      this.router.navigate(['/system/add-product']);
    });

    dialogRef.componentInstance
    .itemAdded
    .subscribe(item => {
      if (!this.stockEntry.items.find(sItem => sItem.id === item.id)) {
        this.stockEntry.items.push(item);
  
        this.simpleStockItems.push(new SimpleStockEntryItem(
          item.id, item?.product?.name, item?.product?.lookupKey, item.quantity
        ));
        
        this.itemsDataSource = new MatTableDataSource(this.simpleStockItems);
        sessionStorage.setItem('target-stock', JSON.stringify(this.stockEntry));
        return;
      }
      
      this.stockEntry.items = this.stockEntry.items.map(sItem => {
        if (sItem.id === item.id) {
          sItem.quantity = item.quantity;
        }

        return sItem;
      });

      this.simpleStockItems = [];

      this.stockEntry.items.forEach(item => {
        this.simpleStockItems.push(new SimpleStockEntryItem(
          item.id, item?.product?.name, item?.product?.lookupKey, item.quantity
        ));
      });

      this.itemsDataSource = new MatTableDataSource(this.simpleStockItems);
      this.itemsDataSource.sort = this.sort;
      this.itemsDataSource.paginator = this.paginator;

      this.searchQuery = '';
      this.itemsDataSource.filter = '';

      sessionStorage.setItem('target-stock', JSON.stringify(this.stockEntry));
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

  showTransferItemDialog(stockItem: StockEntryItem) {
    this.dialogOpener.open(TransferStockItemDialogComponent, {
      disableClose: true,
      data: {
        item: stockItem,
        stock: this.stockEntry,
        staffBranchId: this.staffService.staff?.staffBranch?.branch.id,
      }
    })
    .componentInstance
    .done
    .subscribe(input => {
      const transfer = input.transfer as StockItemTransfer;

      this.stockEntry.items.forEach(item => {
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

  closeStock() {
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

      this.branchService.closeBranchStock(this.stockEntry.id)
      .subscribe(stock => {
        dialogRef.close();

        this. tableColumns = this.tableColumns.filter(item => item !== 'actions');

        this.stockEntry.isOpened = false;
        sessionStorage.setItem('target-stock', JSON.stringify(this.stockEntry));

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
  
  viewItem(item: SimpleStockEntryItem): void {
    const stockItem = this.stockEntry.items.find(ssItem => ssItem.id === item.id);
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

  deleteItem(item: StockEntryItem, e: Event) {
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

        this.stockEntry.items = this.stockEntry.items
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

      this.stockService.deleteStock(this.stockEntry.id)
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
    this.isFetchingStockEntry = true;

    this.companyService.fetchStock(this.stockEntryId)
    .subscribe(stock => {
      this.isFetchingStockEntry = false;
      stock.dateString = new Date(stock?.createdAt).toDateString();

      this.stockEntry = stock;
      this.setupStockItemsTable();
    }, error => {
      this.isFetchingStockEntry = false;

      switch(error.status) {
        case 400: {

        }
      }
    });
  }
}
