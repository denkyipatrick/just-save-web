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

  fetchBranchStockHistory(branchId: string) {
    return this.http.get<Stock[]>(`${this.constants.BRANCHES_URL}/${branchId}/stocks`);
  }

  createBranchStock

  updateBranchProductQuantity(
    branchId: string,
    productId: string,
    newQuantity: number): Observable<BranchProduct> {
    return this.http.put<BranchProduct>(`${this.constants.BRANCH_PRODUCTS_URL}/change-quantity`, {
      branchId, productId, newQuantity
    });
  }

}
