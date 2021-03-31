import { Product } from './../models/product';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private constants: ConstantsService, private http: HttpClient) {
  }

  changeName(productId: string, newName: string): Observable<Product> {
    return this.http.put<Product>(`${this.constants.PRODUCTS_URL}/${productId}/change-name`, {
      name: newName
    });
  }

  changePrice(productId: string, data: any): Observable<Product> {
    return this.http.put<Product>(`${this.constants.PRODUCTS_URL}/${productId}/change-price`, data);
  }
}
