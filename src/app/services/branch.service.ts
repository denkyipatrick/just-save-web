import { StockItemTransfer } from './../models/stockitemtransfer';
import { StockItem } from './../models/stockitem';
import { Stock } from './../models/stock';
import { Observable } from 'rxjs';
import { BranchProduct } from './../models/branchproduct';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  constructor(
    private constants: ConstantsService,
    private http: HttpClient) {
  }

  closeBranchStock(stockId: string) {
    return this.http.patch(`${this.constants.STOCKS_URL}/` + 
    `${stockId}/close`, null);
  }

  createBranchStockItem(data: any) {
    return this.http.post<StockItem>(`${this.constants.STOCK_ITEMS_URL}/`, data);
  }

  fetchBranchStockHistory(branchId: string) {
    return this.http.get<Stock[]>(`${this.constants.BRANCHES_URL}/${branchId}/stocks`);
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
    return this.http.post<StockItemTransfer>(`${this.constants.STOCK_ITEMS_URL}/${itemId}/transfer`, data);
  }

}
