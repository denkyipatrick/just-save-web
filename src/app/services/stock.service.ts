import { Stock } from 'src/app/models/stock';
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

  deleteStock(stockId: string) {
    return this.http.delete<Stock>(`${this.constants.STOCKS_URL}/${stockId}`);
  }

  removeStockItem(itemId: string) {
    return this.http.delete<StockItem>(`${this.constants.STOCK_ITEMS_URL}/${itemId}`);
  }
}
