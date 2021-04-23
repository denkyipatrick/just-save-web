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

  constructor(
    private staffService: StaffService,
    private branchService: BranchService,
    private dialogOpener: MatDialog,
    private route: ActivatedRoute,
    private router: Router
    ) {
    this.stocks = JSON.parse(sessionStorage.getItem('stock-list')) || [];
  }

  ngOnInit(): void {
    // if (!this.stocks) {
      this.fetchStock();
    // }
  }

  fetchStock() {
    this.branchService.fetchBranchStockHistory(this.staffService.staff.staffBranch.branch.id)
    .subscribe(stocks => {
      this.stocks = stocks.map(stock => {
        stock.dateString = new Date(stock.createdAt).toDateString()
        return stock;
      });

      sessionStorage.setItem('stock-list', JSON.stringify(this.stocks));
    }, error => {
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
