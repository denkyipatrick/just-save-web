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

  constructor(private constants: ConstantsService, private http: HttpClient) {
    this.companyId = localStorage.getItem('companyId');
    this.company = JSON.parse(localStorage.getItem('company'));
  }

  createStaff(data: any): Observable<Staff> {
    return this.http.post<Staff>(`${this.constants.STAFF_URL}`, data);
  }
  
  createBranch(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(`${this.constants.BRANCHES_URL}`, branch);
  }

  fetchCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.constants.COMPANIES_URL}/${id}`);
  }

  fetchBranchProducts(branchId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.constants.BRANCHES_URL}/${branchId}/products`);
  }

  fetchCompanyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.constants.COMPANIES_URL}/${this.companyId}/products`);
  }

  fetchBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.constants.COMPANIES_URL}/${this.companyId}/branches`);
  }
}
