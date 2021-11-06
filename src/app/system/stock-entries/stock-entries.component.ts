import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { CreateStockDialogComponent } from './../create-stock-dialog/create-stock-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BranchService } from './../services/branch.service';
import { StaffService } from './../../services/staff.service';
import { CompanyService } from './../../services/company.service';
import { StockEntry } from './../../models/stockentry';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-entries',
  templateUrl: './stock-entries.component.html',
  styleUrls: ['./stock-entries.component.scss']
})
export class StockEntriesComponent implements OnInit {
  stockEntries: StockEntry[] = [];
  isRefreshing: boolean = false;
  isFetchingStocks: boolean;
  isErrorFetchingEntries: boolean;

  tableColumns: string[] = ['date', 'status', 'branch', 'items', 'view'];

  constructor(
    private companyService: CompanyService,
    private branchService: BranchService,
    private staffService: StaffService,
    private dialogOpener: MatDialog,
    private route: ActivatedRoute,
    private router: Router
    ) {
    // this.stockEntries = JSON.parse(sessionStorage.getItem('stock-entry-list')) || [];
    
    // if (this.stockEntries.length) {
    //   this.isRefreshing = true;
    // } else {
    //   this.isFetchingStocks = true;
    // }
  }

  ngOnInit(): void {
    if (this.stockEntries.length) {
      return this.refreshStocks();
    }

    this.fetchStockEntries();
  }

  viewStock(stockEntry: StockEntry) {
    sessionStorage.setItem('target-stock-entry', JSON.stringify(stockEntry));
    this.router.navigate(['./', stockEntry.id], { relativeTo: this.route });
  }

  fetchStockEntries() {
    if (!this.isRefreshing) {
      this.isFetchingStocks = true;
    }

    this.isErrorFetchingEntries = false;

    this.branchService.fetchStockEntries()
    .subscribe(stockEntries => {
      this.isRefreshing = false;

      this.isFetchingStocks = false;
      this.stockEntries = stockEntries.map(stock => {
        stock.dateString = moment(new Date(stock.createdAt)).format("Do MMMM YYYY");
        return stock;
      });
    }, error => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;
      this.isErrorFetchingEntries = true;

      console.error(error);
    });
  }

  refreshStocks() {
    this.isRefreshing = true;
    this.fetchStockEntries();
  }

  fetchCompanyStock() {
    if (!this.isRefreshing) {
      this.isFetchingStocks = true;
    }

    this.companyService.fetchCompanyStockEntries()
    .subscribe(stockEntries => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;
      this.stockEntries = stockEntries.map(stock => {
        stock.dateString = moment(new Date(stock.createdAt)).format("Do MMMM YYYY");
        return stock;
      });

      sessionStorage.setItem('stock-entry-list', JSON.stringify(this.stockEntries));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;
      console.error(error);
    });    
  }

  fetchBranchStock() {
    if (!this.isRefreshing) {
      this.isFetchingStocks = true;
    }

    this.branchService.fetchStockEntries()
    .subscribe(stocks => {
      this.isRefreshing = false;

      this.isFetchingStocks = false;
      this.stockEntries = stocks.map(stock => {
        stock.dateString = moment(new Date(stock.createdAt)).format("Do MMMM YYYY");
        return stock;
      });

      sessionStorage.setItem('stock-entry-list', JSON.stringify(this.stockEntries));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;

      console.error(error);
    });
  }

  createStock() {
    this.dialogOpener.open(CreateStockDialogComponent)
    .componentInstance
    .stockCreated
    .subscribe(stock => {
      stock.dateString = new Date(stock.createdAt).toDateString();
      this.stockEntries.unshift(stock);

      this.dialogOpener.open(OkDialogComponent, {
        disableClose: true,
        data: {
          title: "Stock Created",
          message: "A new stock is created and opened. You can add items to your new stock.",
          okButtonText: 'OK'
        }
      })
      .componentInstance
      .ok
      .subscribe(() => {
        sessionStorage.setItem('target-stock-entry', JSON.stringify(stock));
        this.router.navigate(['./', stock.id], { relativeTo: this.route });
      })
    });
  }
}
