import { StockItem } from './../models/stockitem';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private constants: ConstantsService,
    private http: HttpClient
    ) { }

  removeStockItem(itemId: string) {
    return this.http.delete<StockItem>(`${this.constants.STOCK_ITEMS_URL}/${itemId}`);
  }
}
