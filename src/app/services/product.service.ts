import { Product } from './../models/product';
import { Company } from '../models/company';
import { Branch } from '../models/branch';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private constants: ConstantsService, private http: HttpClient) {
  }
  
  changeName(productId: string, newName: string) {
    return this.http.put<Product>(`${this.constants.PRODUCTS_URL}/${productId}/change-name`, {
      name: newName
    });
  }

  changePrice(productId: string, data: any) {
    return this.http.put<Product>(`${this.constants.PRODUCTS_URL}/${productId}/change-price`, data);
  }
}
