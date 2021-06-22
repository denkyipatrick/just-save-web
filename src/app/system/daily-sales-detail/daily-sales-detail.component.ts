import { Router, ActivatedRoute } from '@angular/router';
import { Order } from './../../models/order';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-daily-sales-detail',
  templateUrl: './daily-sales-detail.component.html',
  styleUrls: ['./daily-sales-detail.component.scss']
})
export class DailySalesDetailComponent implements OnInit {
  date: string;
  orders: Order[];
  customOrders: CustomOrder[] = [];
  filteredCustomOrders: CustomOrder [];
  filteredOrders: Order[];
  totalItems: number = 0;
  totalAmount: number = 0;
  tableColumns = ['name', 'itemPrice', 'quantity', 'totalItemAmount'];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.date = sessionStorage.getItem('target-sales-day');
    this.orders = JSON.parse(sessionStorage.getItem('day-orders'));

    this.orders.forEach(order => {
      order.simpleDate = moment(order.createdAt).format("hh:mm a");

      this.totalItems += order?.items?.length;

      let totalOrderAmount = 0;

      order?.items?.forEach(item => {
        totalOrderAmount += item?.salePrice || item?.orderItemSellingPrice
        this.totalAmount += item?.salePrice || item?.orderItemSellingPrice
      });

      const customOrder = new CustomOrder(
        order.id,
        order.branchId,
        order.companyId,
        order.createdAt,
        order.updatedAt,
        totalOrderAmount)
      
      customOrder.items = order.items;
      customOrder.staff = order.staff;
      customOrder.branch = order.branch;
      customOrder.company = order.company;
      customOrder.simpleDate = order.simpleDate;

      this.customOrders.push(customOrder)
    });

    this.filteredOrders = this.orders;
    this.filteredCustomOrders = this.customOrders;
  }
  
  viewOrder(order: Order) {
    sessionStorage.setItem('target-order', JSON.stringify(order));
    this.router.navigate(['../../orders/', order.id], { relativeTo: this.route })
  }

  getTotalAmount(order: Order) {
    let amount = 0;
    
    order.items.forEach(item => {
      amount += item.salePrice || item.orderItemSellingPrice
    });

    return amount;
  }

  searchOrder(key: string) {
    this.filteredCustomOrders = this.customOrders.filter(order => {
      if (
        order.staff.username.indexOf(key) > -1 ||
        order.staff.firstName.indexOf(key) > -1 ||
        order.staff.lastName.indexOf(key) > -1 ||
        `${order.staff.firstName} ${order.staff.lastName}`.indexOf(key) > -1 ||
        order.simpleDate.indexOf(key) > -1
      ) {
        return order;
      }
    })
  }

}

class CustomOrder extends Order {
  constructor(
    public id: string,
    public branchId: string,
    public companyId: string,
    public createdAt: number,
    public updatedAt: number,
    public totalOrderAmount: number
    ) {
      super(id, branchId, companyId, createdAt, updatedAt)
}
}
