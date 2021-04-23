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
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.scss']
})
export class StockDetailComponent implements OnInit {
  stock: Stock;
  stockId: string = '';
  tableColumns: string[] = ['key', 'name', 'quantity'];
  
  itemsDataSource: MatTableDataSource<StockItem>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private branchService: BranchService,
    private dialogOpener: MatDialog,
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
  
  viewProduct(row: Product): void {
    this.router.navigate(['/system/products/', row.id], { relativeTo: this.route });
  }

  searchProduct(query: string): void {
    this.itemsDataSource.filter = query;
  }

  fetchStock() {
    this.companyService.fetchStock(this.stockId)
    .subscribe(stock => {
      stock.dateString = new Date(stock.createdAt).toDateString();

      this.stock = stock;
      this.itemsDataSource = new MatTableDataSource(this.stock.items);
      this.itemsDataSource.sort = this.sort;
      this.itemsDataSource.paginator = this.paginator;
    }, error => {
      console.error(error);
    });
  }

}
