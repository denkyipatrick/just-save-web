import { Stock } from './../models/stock';
import { StockEntry } from 'src/app/models/stockentry';
import { StockEntryItem } from '../models/stockentryitem';
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

  fetchStock(stockId: string) {
    return this.http.get<Stock>(`${this.constants.STOCKS_URL}/${stockId}`);
  }

  createStockItem(data: any) {
    return this.http.post<StockEntryItem>(`${this.constants.STOCK_ENTRY_ITEMS_URL}`, data);
  }

  deleteStock(stockId: string) {
    return this.http.delete<StockEntry>(`${this.constants.STOCK_ENTRIES_URL}/${stockId}`);
  }

  removeStockItem(itemId: string) {
    return this.http.delete<StockEntryItem>(`${this.constants.STOCK_ENTRY_ITEMS_URL}/${itemId}`);
  }
}
