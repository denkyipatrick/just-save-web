import { Stock } from './../../models/stock';
import { CompanyService } from './../../services/company.service';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateStockDialogComponent } from './../create-stock-dialog/create-stock-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StockEntry } from '../../models/stockentry';
import { BranchService } from './../../services/branch.service';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stocks: Stock[];  
  isFetchingStocks: boolean;
  isRefreshing: boolean = false;
  tableColumns: string[] = ['date', 'status', 'branch', 'view'];

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private branchService: BranchService,
    private dialogOpener: MatDialog,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.stocks = JSON.parse(sessionStorage.getItem('stock-list')) || [];
    
    if (this.stocks.length) {
      this.isRefreshing = true;
    } else {
      this.isFetchingStocks = true;
    }
  }

  ngOnInit() {
    this.fetchStocks();
  }
  
  fetchStocks() {
    if (this.staffService.staff.isAdmin) {
      this.fetchCompanyStocks();
    } else {
      this.fetchBranchStocks();
    }
  }  

  viewStock(stock: StockEntry) {
    sessionStorage.setItem('target-stock', JSON.stringify(stock));
    this.router.navigate(['./', stock.id], { relativeTo: this.route });
  }

  refreshStocks() {
    this.isRefreshing = true;
    this.fetchStocks();
  }

  fetchBranchStocks() {
    if (!this.isRefreshing) {
      this.isFetchingStocks = true;
    }

    this.branchService.fetchBranchStockHistory()
    .subscribe(stocks => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;

      this.stocks = stocks.map(stock => {
        stock.dateString = moment(new Date(stock.createdAt)).format("Do MMMM YYYY");
        return stock;
      });

      sessionStorage.setItem('stock-list', JSON.stringify(this.stocks));

      console.log(stocks);
    }, error => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;
    })
  }

  fetchCompanyStocks() {
    if (!this.isRefreshing) {
      this.isFetchingStocks = true;
    }

    this.companyService.fetchCompanyStocks()
    .subscribe(stocks => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;

      this.stocks = stocks.map(stock => {
        stock.dateString = moment(new Date(stock.createdAt)).format("Do MMMM YYYY");
        return stock;
      });

      sessionStorage.setItem('stock-list', JSON.stringify(this.stocks));

      console.log(stocks);
    }, error => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;
    })
  }
}
