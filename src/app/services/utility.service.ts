import { CompanyService } from './company.service';
import { Product } from './../models/product';
import { Role } from './../models/role';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from '../models/branch';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  appName: string = "Zoma and Sons Bicycle Parts";
  appSlogan: string = "Manage and sell bicycle parts";

  constructor(
    private constants: ConstantsService, 
    private companyService: CompanyService,
    private http: HttpClient) {
    this.appSlogan = "Store Management System";
    this.appName = this.companyService.company?.name;
    this.appSlogan = "System Slogan";
  }

  fetchSystemRoles() {
    return this.http.get<Role[]>(`${this.constants.ROLES_URL}`);
  }

  fetchBranches() {
    return this.http.get<Branch[]>(`${this.constants.BRANCHES_URL}`);
  }
  
  lookupProduct(lookupKey: string) {
    return this.http.get<Product[]>(`${this.constants.PRODUCTS_URL}/lookup/${lookupKey}`);
  }
}
