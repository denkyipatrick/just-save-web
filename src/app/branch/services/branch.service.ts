import { Branch } from './../../models/branch';
import { Company } from './../../models/company';
import { Product } from './../models/product';
import { RoutesService } from './../../services/routes.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  branchCompany: Company = JSON.parse(
    localStorage.getItem('branch-setup-company')
  );
  branch: Branch = JSON.parse(
    localStorage.getItem('setup-branch')
  );

  constructor(
    private http: HttpClient,
    private routesService: RoutesService
  ) { }

  fetchProducts() {
    return this.http.get<Product[]>(
      `${this.routesService.BRANCHES_URL}/${this.branch.id}/products`
    );
  }

  createProduct(data: any) {
    return this.http.post<Product>(
      `${this.routesService.PRODUCTS_URL}`, data
    );
  }
  
  changeProductQuantity(productId: any, quantity: number, type: string) {
    console.log('working', type)
    const data = {
      quantity: quantity
    }

    let url = "";
    type = type.toLowerCase();

    if (type === 'add') {
      url = `${this.routesService.PRODUCTS_URL}/${productId}/add-quantity`
    } else if (type === 'subtract') {
      url = `${this.routesService.PRODUCTS_URL}/${productId}/remove-quantity`
    }

    console.log(url);

    return this.http.patch<Product>(url, data);
  }
}
