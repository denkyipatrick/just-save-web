import { Product } from './../models/product';
import { Company } from './../models/company';
import { Branch } from './../models/branch';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

  fetchCompany(id: string) {
    return this.http.get<Company>(`${this.constants.COMPANIES_URL}/${id}`);
  }

  fetchBranchProducts(branchId: string) {
    return this.http.get<Product[]>(`${this.constants.BRANCHES_URL}/${branchId}/products`);
  }

  fetchCompanyProducts() {
    return this.http.get<Product[]>(`${this.constants.COMPANIES_URL}/${this.companyId}/products`);
  }

  fetchBranches() {
    return this.http.get<Branch[]>(`${this.constants.COMPANIES_URL}/${this.companyId}/branches`);
  }
}
