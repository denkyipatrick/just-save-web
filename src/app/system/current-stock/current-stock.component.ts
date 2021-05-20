import { SimpleStockItem } from '../../models/simplestockitem';
import { Stock } from 'src/app/models/stock';
import { StaffService } from './../../services/staff.service';
import { BranchService } from './../../services/branch.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrls: ['./current-stock.component.scss']
})
export class CurrentStockComponent implements OnInit {
  activeStock: Stock;
  stockDate: string;
  simpleStockItems: SimpleStockItem[] = [];
  isFetchingStock: boolean;

  tableColumns: string[] = [
    'productKey',
    'productName',
    'quantityStocked',
    'previousStockRemainingQuantity',
    'quantitySold',
    'remainingQuantity'
  ]

  constructor(
    private staffService: StaffService,
    private branchService: BranchService
  ) {
    this.activeStock = JSON.parse(sessionStorage.getItem('active-stock'));
  }

  ngOnInit(): void {
    if (!this.activeStock) {
      return this.fetchCurrentStock();
    }

    this.setupStock();
  }

  setupStock() {
    this.stockDate = moment(this.activeStock.createdAt).format("Do MMM YYYY");

    this.activeStock.items.forEach(item => {
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
  }

  fetchCurrentStock() {
    this.branchService.fetchActiveStock(this.staffService.staff.staffBranch.branch.id)
    .subscribe(stock => {
      this.activeStock = stock;
      this.setupStock();

      sessionStorage.setItem('active-stock', JSON.stringify(this.activeStock));
    });
  }

}
