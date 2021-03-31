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
    private constantsService: ConstantsService) {
      this.branchId = localStorage.getItem('branchId');
      this.staff = JSON.parse(sessionStorage.getItem('staff'));

      // console.log(localStorage.getItem('branchId'))
  }

  signIn(data: object): Observable<Staff> {
    return this.http.post<Staff>(`${this.constantsService.STAFF_URL}/auth`, data);
  }

  createBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(`${this.constantsService.BRANCHES_URL}`, branch);
  }

  createStaff(data: any): Observable<Staff> {
    return this.http.post<Staff>(`${this.constantsService.STAFF_URL}`, data);
  }

  fetchAllStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.constantsService.BRANCHES_URL}/${this.branchId}/staffs`);
  }

  fetchStaff(username: string): Observable<Staff> {
    return this.http.get<Staff>(`${this.constantsService.STAFF_URL}/${username}`);
  }

  addStaffRole(data: any): Observable<Role> {
    return this.http.post<Role>(`${this.constantsService.STAFF_ROLES_URL}`, data);
  }

  removeStaffRole(staffUsername: string, roleId: string): Observable<Role> {
    return this.http.delete<Role>(`${this.constantsService.STAFF_ROLES_URL}/` +
    `${staffUsername}/${roleId}`);
  }

  changeName(username: string, data: any): Observable<Staff> {
    return this.http.put<Staff>(`${this.constantsService.STAFF_URL}/` +
    `${this.staff.username}/change-name`, data);
  }

  changePassword(staffId: string, data: any): Observable<Staff> {
    return this.http.put<Staff>(`${this.constantsService.STAFF_URL}/${staffId}/change-password`, data);
  }

  createProduct(data: any): Observable<Product> {
    data.branchId = this.branchId;
    return this.http.post<Product>(`${this.constantsService.PRODUCTS_URL}`, data);
  }

  fetchProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.constantsService.PRODUCTS_URL}/${productId}`);
  }

  fetchProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.constantsService.PRODUCTS_URL}`);
  }
}
