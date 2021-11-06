import { BranchOrder } from './../../models/branchorder';
import { Order } from './../../models/order';
import { StockEntry } from './../../models/stockentry';
import { Company } from './../../models/company';
import { Staff } from './../../models/staff';
import { BranchProduct } from './../../models/branchproduct';
import { Product } from './../../models/product';
import { RoutesService } from './../../services/routes.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  branchId = localStorage.getItem('branch-id');
  loggedInStaff = JSON.parse(localStorage.getItem('logged-in-staff'));
  company: Company = JSON.parse(localStorage.getItem('branch-setup-company'));

  constructor(
    private routesService: RoutesService,
    private http: HttpClient
  ) { }

  createOrder(data: any) {
    return this.http.post<Order>(
      `${this.routesService.BRANCH_ORDERS_URL}`, data
    );
  }

  fetchOrders() {
    return this.http.get<BranchOrder[]>(`${this.routesService.BRANCHES_URL}/` + 
    `${this.branchId}/orders`);
  }

  fetchStaff(staffId: string) {
    return this.http.get<Staff>(
      `${this.routesService.STAFF_URL}/${staffId}`
    );
  }

  fetchStaffs() {
    return this.http.get<Staff[]>(`${this.routesService.BRANCHES_URL}/` + 
    `${this.branchId}/staffs`);
  }
  
  fetchStockEntries() {
    return this.http.get<StockEntry[]>(`${this.routesService.BRANCHES_URL}/` + 
    `${this.branchId}/stock-entries`);
  }
  
  fetchStockEntry(entryId: any) {
    return this.http.get<StockEntry>(
      `${this.routesService.STOCK_ENTRIES_URL}/${entryId}`
    );
  }

  closeStockEntry(stockEntryId: string) {
    return this.http.patch(`${this.routesService.STOCK_ENTRIES_URL}/` + 
    `${stockEntryId}/close`, null);
  }

  createStockEntry(data: any) {
    return this.http.post<StockEntry>(
      `${this.routesService.STOCK_ENTRIES_URL}`, data
    );
  }

  fetchProducts() {
    return this.http.get<BranchProduct[]>(`${this.routesService.BRANCHES_URL}/` + 
    `${this.branchId}/products`);
  }

  fetchCompanyProducts() {
    return this.http.get<Product[]>(`${this.routesService.PRODUCTS_URL}`);
  }
  
  fetchBranchProduct(branchProductId: string) {
    return this.http.get<BranchProduct>(
      `${this.routesService.BRANCH_PRODUCTS_URL}/${branchProductId}`
    );
  }

  createProduct(data: any) {
    return this.http.post<BranchProduct>(
      `${this.routesService.BRANCH_PRODUCTS_URL}`, data
    );
  }
  
  deleteBranchProduct(branchProductId: any) {
    return this.http.delete<BranchProduct>(
      `${this.routesService.BRANCH_PRODUCTS_URL}/${branchProductId}`
    );
  }

  changeProductQuantity(branchProductId: any, quantity: number, type: string) {
    const data = {
      quantity: quantity
    }

    let url = "";
    type = type.toLowerCase();

    if (type === 'add') {
      url = `${this.routesService.BRANCH_PRODUCTS_URL}/${branchProductId}/add-quantity`
    } else if (type === 'subtract') {
      url = `${this.routesService.BRANCH_PRODUCTS_URL}/${branchProductId}/remove-quantity`
    }

    return this.http.patch<BranchProduct>(url, data);
  }
}
