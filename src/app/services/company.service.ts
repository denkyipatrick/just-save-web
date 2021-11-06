import { RoutesService } from './routes.service';
import { Stock } from './../models/stock';
import { StockEntry } from 'src/app/models/stockentry';
import { Order } from './../models/order';
import { Observable } from 'rxjs';
import { Product } from './../models/product';
import { Company } from './../models/company';
import { Branch } from './../models/branch';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Staff } from '../models/staff';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  company: Company;
  companyId: string;

  constructor(
    private http: HttpClient,
    private routesService: RoutesService
  ) {
    this.companyId = localStorage.getItem('companyId');
    this.company = JSON.parse(localStorage.getItem('company'));
  }

  createStaff(data: any): Observable<Staff> {
    return this.http.post<Staff>(
      `${this.routesService.STAFF_URL}`, data
    );
  }
  
  createProduct(data: any): Observable<Product> {
    return this.http.post<Product>(
      `${this.routesService.PRODUCTS_URL}`, data
    );
  }

  fetchStaffs() {
    return this.http.get<Staff[]>(
      `${this.routesService.COMPANIES_URL}/${this.companyId}/staffs`
    );
  }
  
  createBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(
      `${this.routesService.BRANCHES_URL}`, branch
    );
  }

  fetchCompany(id: string): Observable<Company> {
    return this.http.get<Company>(
      `${this.routesService.COMPANIES_URL}/${id}`
    );
  }

  fetchBranchProducts(branchId: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.routesService.BRANCHES_URL}/${branchId}/products`
    );
  }
  
  lookupProduct(lookupKey: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.routesService.COMPANIES_URL}/` +
      `${this.companyId}/products/lookup/${lookupKey}`
    );
  }

  fetchCompanyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.routesService.COMPANIES_URL}/${this.companyId}/products`
    );
  }

  fetchBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(
      `${this.routesService.COMPANIES_URL}/${this.companyId}/branches`
    );
  }

  fetchOrders() {
    return this.http.get<Order[]>(
      `${this.routesService.COMPANIES_URL}/${this.companyId}/orders`
    );
  }

  fetchStock(stockId: string) {
    return this.http.get<StockEntry>(
      `${this.routesService.STOCK_ENTRIES_URL}/${stockId}`
    );
  }

  fetchAllBranchActiveStocks() {
    return this.http.get<Stock[]>(
      `${this.routesService.COMPANIES_URL}/${this.companyId}` +
      `/branch-active-stocks`
    );
  }
  
  fetchCompanyStockEntries() {
    return this.http.get<StockEntry[]>(
      `${this.routesService.COMPANIES_URL}/${this.companyId}/stock-entries`
    );
  }

  fetchCompanyStocks() {
    return this.http.get<Stock[]>(
      `${this.routesService.COMPANIES_URL}/${this.companyId}/stocks`
    );
  }
}
