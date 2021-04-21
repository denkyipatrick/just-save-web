import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  SERVER_URL: string;
  STAFF_URL: string;
  ROLES_URL: string;
  ORDERS_URL: string;
  STOCKS_URL: string;
  BRANCHES_URL: string;
  PRODUCTS_URL: string;
  COMPANIES_URL: string;
  STAFF_ROLES_URL: string;
  BRANCH_PRODUCTS_URL: string;

  constructor() {
    this.SERVER_URL = environment.apiUrl;
    this.STAFF_URL = `${this.SERVER_URL}/staff`;
    this.ROLES_URL = `${this.SERVER_URL}/roles`;
    this.ORDERS_URL = `${this.SERVER_URL}/orders`;
    this.STOCKS_URL = `${this.SERVER_URL}/stocks`;
    this.BRANCHES_URL = `${this.SERVER_URL}/branches`;
    this.PRODUCTS_URL = `${this.SERVER_URL}/products`;
    this.COMPANIES_URL = `${this.SERVER_URL}/companies`;
    this.STAFF_ROLES_URL = `${this.SERVER_URL}/staffroles`;
    this.BRANCH_PRODUCTS_URL = `${this.SERVER_URL}/branchproducts`;
  }
}
