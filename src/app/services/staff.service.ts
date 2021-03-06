import { RoutesService } from './routes.service';
import { StockEntry } from '../models/stockentry';
import { Order } from './../models/order';
import { CartItem } from './../models/cartitem';
import { Staff } from './../models/staff';
import { Role } from './../models/role';
import { Product } from './../models/product';
import { Branch } from './../models/branch';
import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  staff: Staff;
  branchId: string;
  constructor(
    private http: HttpClient,
    private routesService: RoutesService) {
      this.branchId = localStorage.getItem('branchId');
      this.staff = JSON.parse(sessionStorage.getItem('staff'));
  }

  signIn(data: object): Observable<Staff> {
    return this.http.post<Staff>(
      `${this.routesService.STAFF_URL}/auth`, data
    );
  }

  createBranchStock(data: any) {
    return this.http.post<StockEntry>(
      `${this.routesService.STOCK_ENTRIES_URL}`, data
    );
  }

  createBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(
      `${this.routesService.BRANCHES_URL}`, branch
    );
  }

  createStaff(data: any): Observable<Staff> {
    return this.http.post<Staff>(
      `${this.routesService.STAFF_URL}`, data
    );
  }

  fetchAllStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(
      `${this.routesService.BRANCHES_URL}/${this.branchId}/staffs`
    );
  }

  fetchStaff(staffId: string): Observable<Staff> {
    return this.http.get<Staff>(
      `${this.routesService.STAFF_URL}/${staffId}`
    );
  }

  addStaffRole(data: any): Observable<Role> {
    return this.http.post<Role>(
      `${this.routesService.STAFF_ROLES_URL}`, data
    );
  }

  removeStaffRole(staffRoleId: string): Observable<Role> {
    return this.http.delete<Role>(
      `${this.routesService.STAFF_ROLES_URL}/${staffRoleId}`
    );
  }

  changeName(username: string, data: any): Observable<Staff> {
    return this.http.put<Staff>(
      `${this.routesService.STAFF_URL}/` +
      `${this.staff.username}/change-name`,
      data
    );
  }

  changePassword(staffId: string, data: any): Observable<Staff> {
    return this.http.put<Staff>(
      `${this.routesService.STAFF_URL}/${staffId}/change-password`, data
    );
  }

  createProduct(data: any): Observable<Product> {
    data.branchId = this.branchId;
    return this.http.post<Product>(
      `${this.routesService.PRODUCTS_URL}`, data
    );
  }

  fetchProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(
      `${this.routesService.PRODUCTS_URL}/${productId}`
    );
  }

  // fetchProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(`${this.constantsService.PRODUCTS_URL}`);
  // }

  startOrder(data: any) {
    return this.http.post<Order>(
      `${this.routesService.ORDERS_URL}`, data
    );
  }

  fetchOrderDetail(orderId: any) {
    return this.http.get<Order>(
      `${this.routesService.ORDERS_URL}/${orderId}`
    );
  }

  fetchBranchOrders(branchId: string) {
    return this.http.get<Order[]>(
      `${this.routesService.BRANCHES_URL}/${branchId}/orders`
    );
  }
}
