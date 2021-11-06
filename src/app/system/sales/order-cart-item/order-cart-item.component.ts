import { CartItem } from './../../../models/cartitem';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-cart-item',
  templateUrl: './order-cart-item.component.html',
  styleUrls: ['./order-cart-item.component.scss']
})
export class OrderCartItemComponent implements OnInit {
  @Input() item: CartItem;
  @Output() delete: EventEmitter<any>;
  @Output() priceChanged: EventEmitter<CartItem>;
  @Output() quantityChanged: EventEmitter<CartItem>;

  constructor() {
    this.priceChanged = new EventEmitter();
    this.quantityChanged = new EventEmitter();
  }

  ngOnInit(): void {
  }

  changePrice(newPrice: number) {
    this.item.soldPrice = +newPrice;
    // this.priceChanged.emit(this.item);
    console.log(this.item);
  }

  changeQuantity(newQuantity: number) {
    this.item.quantity = +newQuantity;
    this.quantityChanged.emit(this.item);
  }

}
