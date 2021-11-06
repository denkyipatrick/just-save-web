import { RoutesService } from './routes.service';
import { StockItem } from './../models/stockitem';
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
    private http: HttpClient,
    private routesService: RoutesService
  ) { }

  fetchStock(stockId: string) {
    return this.http.get<Stock>(
      `${this.routesService.STOCKS_URL}/${stockId}`
    );
  }

  createStockItem(data: any) {
    return this.http.post<StockEntryItem>(
      `${this.routesService.STOCK_ENTRY_ITEMS_URL}`, data
    );
  }

  updateStockItemQuantity(stockItemId: string, data: any) {
    return this.http.patch<StockItem>(
      `${this.routesService.STOCK_ITEMS_URL}/` +
      `${stockItemId}/edit-quantity`,
      data
    );
  }

  deleteStock(stockId: string) {
    return this.http.delete<StockEntry>(
      `${this.routesService.STOCK_ENTRIES_URL}/${stockId}`
    );
  }

  removeStockItem(itemId: string) {
    return this.http.delete<StockEntryItem>(
      `${this.routesService.STOCK_ENTRY_ITEMS_URL}/${itemId}`
    );
  }
}
