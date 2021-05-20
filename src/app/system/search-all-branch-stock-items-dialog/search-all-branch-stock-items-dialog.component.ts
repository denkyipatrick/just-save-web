import { Stock } from './../../models/stock';
import { CompanyService } from './../../services/company.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-all-branch-stock-items-dialog',
  templateUrl: './search-all-branch-stock-items-dialog.component.html',
  styleUrls: ['./search-all-branch-stock-items-dialog.component.scss']
})
export class SearchAllBranchStockItemsDialogComponent implements OnInit {
  stocks: Stock[];
  filteredStocks: Stock[];
  tableColumns: string[] = ['key', 'name', 'quantity'];

  isFetchingStocks: boolean;
  isErrorFetchingStocks: boolean;

  constructor(
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<SearchAllBranchStockItemsDialogComponent>
  ) { }

  ngOnInit(): void {
    this.fetchCompanyActiveStocks();
  }

  close() {
    this.dialogRef.close();
  }

  fetchCompanyActiveStocks() {
    this.isFetchingStocks = true;
    this.isErrorFetchingStocks = false;

    this.companyService.fetchAllBranchActiveStocks()
    .subscribe(stocks => {
      this.isFetchingStocks = false;
      this.stocks = stocks;

      this.filteredStocks = stocks;
    }, error => {
      this.isFetchingStocks = false;
      this.isErrorFetchingStocks = true;
    });
  }

  clearSearchField(input: HTMLInputElement) {
    input.value = "";
    this.searchProduct('');
  }

  searchProduct(query: string) {
    if (!query.length) {
      return this.filteredStocks = this.stocks;
    }

    const stocks: Stock[] = JSON.parse(JSON.stringify(this.stocks));

    this.filteredStocks = stocks.filter(stock => {
      if (stock.branch?.name?.toLowerCase()?.indexOf(query) > -1) {
        return stock;
      }

      const stockItem = stock.items.find(item =>
        item.product.name.toLowerCase().indexOf(query.toLowerCase()) > -1);

      if (stockItem) {
        return stock.items = [stockItem];
      }

      return null;
    });
  }

}
