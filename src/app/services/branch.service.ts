import { StockItemTransfer } from './../models/stockitemtransfer';
import { StockEntryItem } from '../models/stockentryitem';
import { StockEntry } from '../models/stockentry';
import { Observable } from 'rxjs';
import { BranchProduct } from './../models/branchproduct';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import { Stock } from '../models/stock';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  branchId: string;

  constructor(
    private constants: ConstantsService,
    private http: HttpClient) {
      this.branchId = sessionStorage.getItem('branchId');
  }

  closeBranchStock(stockId: string) {
    return this.http.patch(`${this.constants.STOCK_ENTRIES_URL}/` + 
    `${stockId}/close`, null);
  }

  createBranchStockItem(data: any) {
    return this.http.post<StockEntryItem>(`${this.constants.STOCK_ENTRY_ITEMS_URL}/`, data);
  }

  fetchBranchStockHistory() {
    return this.http.get<Stock[]>(`${this.constants.BRANCHES_URL}/${this.branchId}/stocks`);
  }

  fetchBranchStockEntryHistory(branchId: string) {
    return this.http.get<StockEntry[]>(`${this.constants.BRANCHES_URL}/${branchId}/stock-entries`);
  }

  fetchProducts(branchId: string) {
    return this.http.get<BranchProduct[]>(`${this.constants.BRANCHES_URL}/${branchId}/products`);
  }

  fetchActiveStock(branchId: string) {
    return this.http.get<Stock>(`${this.constants.BRANCHES_URL}/${branchId}/active-stock`);
  }

  updateBranchProductQuantity(
    branchId: string,
    productId: string,
    newQuantity: number): Observable<BranchProduct> {
    return this.http.put<BranchProduct>(`${this.constants.BRANCH_PRODUCTS_URL}/change-quantity`, {
      branchId, productId, newQuantity
    });
  }

  transferBranchItem(itemId: string, data: any) {
    return this.http.post<StockItemTransfer>(`${this.constants.STOCK_ENTRY_ITEMS_URL}/${itemId}/transfer`, data);
  }

}
