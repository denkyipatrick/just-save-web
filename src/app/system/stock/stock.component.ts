import { CompanyService } from './../../services/company.service';
import { OkDialogComponent } from './../../dialog/ok-dialog/ok-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateStockDialogComponent } from './../create-stock-dialog/create-stock-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Stock } from './../../models/stock';
import { BranchService } from './../../services/branch.service';
import { StaffService } from './../../services/staff.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  stocks: Stock[] = [];
  isRefreshing: boolean = false;
  isFetchingStocks: boolean;

  tableColumns: string[] = ['date', 'status', 'branch', 'items', 'view'];

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

  ngOnInit(): void {
    if (this.stocks.length) {
      return this.refreshStocks();
    }

    this.fetchStocks();
  }

  viewStock(stockId: string) {
    this.router.navigate(['./', stockId], { relativeTo: this.route });
  }

  fetchStocks() {
    console.log('isAdmin', this.staffService.staff.isAdmin);
    if (this.staffService.staff.isAdmin) {
      this.fetchCompanyStock();
    } else {
      this.fetchBranchStock();
    }
  }

  refreshStocks() {
    this.isRefreshing = true;
    this.fetchStocks();
  }

  fetchCompanyStock() {
    if (!this.isRefreshing) {
      this.isFetchingStocks = true;
    }

    this.companyService.fetchCompanyStocks()
    .subscribe(stocks => {
      this.isRefreshing = false;
      this.isFetchingStocks = false;
      this.stocks = stocks.map(stock => {
        stock.dateString = new Date(stock.createdAt).toDateString()
        return stock;
      });

      sessionStorage.setItem('stock-list', JSON.stringify(this.stocks));
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

    this.branchService.fetchBranchStockHistory(this.staffService.staff.staffBranch.branch.id)
    .subscribe(stocks => {
      this.isRefreshing = false;

      this.isFetchingStocks = false;
      this.stocks = stocks.map(stock => {
        stock.dateString = new Date(stock.createdAt).toDateString()
        return stock;
      });

      sessionStorage.setItem('stock-list', JSON.stringify(this.stocks));
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
      this.stocks.unshift(stock);

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
        this.router.navigate(['./', stock.id], { relativeTo: this.route });
      })
    });
  }
}
