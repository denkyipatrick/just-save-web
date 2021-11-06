import { RoutesService } from './routes.service';
import { Product } from './../models/product';
import { ConstantsService } from './constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private routesService: RoutesService) {
  }

  changeName(productId: string, newName: string): Observable<Product> {
    return this.http.put<Product>(
      `${this.routesService.PRODUCTS_URL}/${productId}/change-name`, {
      name: newName
    });
  }

  changePrice(productId: string, data: any): Observable<Product> {
    return this.http.put<Product>(
      `${this.routesService.PRODUCTS_URL}/${productId}/change-price`,
      data
    );
  }
}
