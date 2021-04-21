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
  stocks: Stock[];

  constructor(
    private staffService: StaffService,
    private branchService: BranchService,
    private dialogOpener: MatDialog,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.branchService.fetchBranchStockHistory(this.staffService.staff.staffBranch.branch.id)
    .subscribe(stocks => {
      console.log(stocks);
      this.stocks = stocks;
    }, error => {
      console.error(error);
    });
  }

  createStock() {
    this.dialogOpener.open(CreateStockDialogComponent)
    .componentInstance
    .stockCreated
    .subscribe(stock => {
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
