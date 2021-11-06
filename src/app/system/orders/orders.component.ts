import { BranchService } from './../services/branch.service';
import { BranchOrder } from './../../models/branchorder';
import { StaffService } from './../../services/staff.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from './../../models/order';
import { CompanyService } from './../../services/company.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[];
  branchOrders: BranchOrder[];
  isRefreshing: boolean = false;
  isFetchingOrders: boolean;
  isErrorFetchingOrders: boolean;

  tableColumns: string[];
  table2Columns: string[];
  dataSource: MatTableDataSource<Order>;
  dataSource2: MatTableDataSource<any>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  orderGroups: Map<string, BranchOrder[]> = new Map();
  dataSourceInput: any = [];

  constructor(
    private branchService: BranchService,
    private companyService: CompanyService,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.table2Columns = ['date', 'totalItems', 'totalAmount', 'action'];
    this.tableColumns = ['id', 'served', 'items', 'branch', 'date', 'action'];
    // this.orders = JSON.parse(sessionStorage.getItem('orders'));
  }

  ngOnInit(): void {
    if (this.orders) {
      return this.refreshOrders();
    }

    this.fetchOrders();
  }
  
  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  setupPaginator() {
    this.dataSource = new MatTableDataSource(this.orders);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  searchOrderDay(key: string) {
    this.dataSource2.filter = key;
  }

  viewOrder(order: Order) {
    sessionStorage.setItem('target-order', JSON.stringify(order));
    this.router.navigate(['./', order.id], { relativeTo: this.route })
  }

  viewDailySale(date) {
    sessionStorage.setItem('target-sales-day', date)
    sessionStorage.setItem('day-orders', JSON.stringify(this.orderGroups.get(date)))

    this.router.navigate(['./', date], { relativeTo: this.route })
  }

  refreshOrders() {
    this.isRefreshing = true;
    this.groupOrdersIntoDates();
    this.setupPaginator();
    this.fetchOrders();
  }

  fetchOrders() {
    if (!this.isRefreshing) {
      this.isFetchingOrders = true;
    }

    this.isErrorFetchingOrders = false;

    this.branchService.fetchOrders()
    .subscribe(branchOrders => {
      this.isRefreshing = false;
      this.isFetchingOrders = false;

      this.branchOrders = branchOrders.map(order => {
        order.maskedId = order.id.substring(order.id.lastIndexOf('-'), 5);
        order.simpleDate = moment(new Date(order.createdAt)).format("Do MMMM YYYY hh:mm a");

        return order;
      });

      this.groupOrdersIntoDates();
      this.setupPaginator();

      sessionStorage.setItem('orders', JSON.stringify(branchOrders));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingOrders = false;
      this.isErrorFetchingOrders = true;
    });
  }

  groupOrdersIntoDates() {
    const dates = [];
    this.dataSourceInput = [];

    this.branchOrders.forEach(branchOrder => {
      const formattedOrderDate = moment(branchOrder.createdAt).format("Do MMMM YYYY");

      if (!this.orderGroups.has(formattedOrderDate)) {
        dates.push(formattedOrderDate)
        this.orderGroups.set(formattedOrderDate, null)
      }

    });

    for (let key of this.orderGroups.keys()) {
      const orders = this.branchOrders.filter(order => {
        if (moment(order.createdAt).format("Do MMMM YYYY") == key) {
          return order;
        }
      });

      this.orderGroups.set(key, orders);
    }

    this.orderGroups.forEach((orders, key) => {
      let totalItems = 0;
      let totalAmount = 0;

      orders.forEach(order => {
        totalItems += order.items.length;
        order.items.forEach(item => {
          totalAmount += item.salePrice || item.orderItemSellingPrice
        })
      });

      this.dataSourceInput.push({
        date: key,
        totalItems: totalItems,
        totalAmount: totalAmount
      });
    });

    this.dataSource2 = new MatTableDataSource(this.dataSourceInput);
  }

  fetchCompanyOrders() {
    if (!this.isRefreshing) {
      this.isFetchingOrders = true;
    }

    this.isErrorFetchingOrders = false;

    this.companyService.fetchOrders()
    .subscribe(orders => {
      this.isRefreshing = false;
      this.isFetchingOrders = false;

      this.orders = orders.map(order => {
        const orderDateCreated = new Date(order.createdAt);
        order.maskedId = order.id.substring(order.id.lastIndexOf('-'), 5);
        order.simpleDate = moment(orderDateCreated).format("Do MMMM YYYY hh:mm a");

        return order;
      });

      this.groupOrdersIntoDates();
      this.setupPaginator();

      sessionStorage.setItem('orders', JSON.stringify(orders));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingOrders = false;
      this.isErrorFetchingOrders = true;
    });
  }

}
