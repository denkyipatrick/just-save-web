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

  updateBranchProductQuantity(branchId: string, productId: string, newQuantity: number) {
    return this.http.put<BranchProduct>(`${this.constants.BRANCH_PRODUCTS_URL}/change-quantity`, {
      branchId, productId, newQuantity
    });
  }
  
}
