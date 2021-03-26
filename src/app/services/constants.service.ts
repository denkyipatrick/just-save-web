import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  SERVER_URL: string = 'https://lollandscreditunion.com:4900/api';
  // SERVER_URL: string = 'http://localhost:4900/api';

  STAFF_URL: string;
  ROLES_URL: string;
  BRANCHES_URL: string;
  PRODUCTS_URL: string;
  COMPANIES_URL: string;
  STAFF_ROLES_URL: string;

  constructor() {
    this.STAFF_URL = `${this.SERVER_URL}/staff`;
    this.ROLES_URL = `${this.SERVER_URL}/roles`;
    this.BRANCHES_URL = `${this.SERVER_URL}/branches`;
    this.PRODUCTS_URL = `${this.SERVER_URL}/products`;
    this.COMPANIES_URL = `${this.SERVER_URL}/companies`;
    this.STAFF_ROLES_URL = `${this.SERVER_URL}/staffroles`;
  }
}
