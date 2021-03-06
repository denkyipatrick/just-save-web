import { MatDialog } from '@angular/material/dialog';
import { StockItem } from './../../models/stockitem';
import { MatPaginator } from '@angular/material/paginator';
import { StockService } from './../../services/stock.service';
import { SimpleStockItem } from './../../models/simplestockitem';
import { Stock } from './../../models/stock';
import { BranchService } from './../../services/branch.service';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { EditStockitemQuantityDialogComponent } from '../edit-stockitem-quantity-dialog/edit-stockitem-quantity-dialog.component';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stock: Stock;
  stockId: string;
  stockDate: string;
  simpleStockItems: SimpleStockItem[] = [];
  isFetchingStock: boolean;

  searchKey: string;

  tableColumns: string[] = [
    'productKey',
    'productName',
    'quantityStocked',
    'previousStockRemainingQuantity',
    'quantitySold',
    'remainingQuantity',
    'menu'
  ];

  paginator: MatPaginator;
  tableDataSource: MatTableDataSource<SimpleStockItem>;

  constructor(
    private stockService: StockService,
    private staffService: StaffService,
    private branchService: BranchService,
    private dialogOpener: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.stock = JSON.parse(sessionStorage.getItem('target-stock'));
    this.searchKey = sessionStorage.getItem('stock-detail-search-key');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.stockId = params['id'];
    });

    if (!this.stock) {
      return this.fetchStock();
    }

    this.setupStock();
  }

  showEditQuantityDialog(item: SimpleStockItem) {
    let stockItem: StockItem = this.stock.items.find(sItem => sItem.id === item.id);

    console.log(stockItem);

    this.dialogOpener.open(EditStockitemQuantityDialogComponent, {
      data: {
        stockItem: stockItem
      }
    })
    .componentInstance
    .updated
    .subscribe(updatedItem => {
      for (const item of this.stock.items) {
        if (item.id === updatedItem.id) {
          item.quantityStocked = updatedItem.quantityStocked;
          item.availableQuantity = updatedItem.availableQuantity;
          break;
        }
      }

      sessionStorage.setItem('target-stock', JSON.stringify(this.stock));
      this.setupStock();
    });
  }

  setupStock() {
    this.stockDate = moment(this.stock.createdAt).format("Do MMM YYYY");

    this.simpleStockItems = [];
    
    this.stock.items.forEach(item => {
      this.simpleStockItems.push(
        new SimpleStockItem(
          item.id,
          item.product.name,
          item.product.lookupKey,
          item.quantitySold,
          item.quantityStocked,
          item.availableQuantity,
          item.quantityFromPreviousStock
        )
      )
    });

    this.tableDataSource = new MatTableDataSource(this.simpleStockItems);
    this.tableDataSource.paginator = this.paginator;
  }
  
  searchProduct(query: string): void {
    this.tableDataSource.filter = query;
    sessionStorage.setItem('stock-detail-search-key', query);
  }

  clearSearchField(input: HTMLInputElement) {
    input.value = "";
    this.searchKey = "";
    this.searchProduct('');
    sessionStorage.removeItem('stock-detail-search-key');
  }

  fetchStock() {
    this.stockService.fetchStock(this.stockId)
    .subscribe(stock => {
      this.stock = stock;
      this.setupStock();

      sessionStorage.setItem('active-stock', JSON.stringify(this.stock));
    });
  }

}
