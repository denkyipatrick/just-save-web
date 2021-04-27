import { StaffService } from './../../services/staff.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from './../../models/order';
import { CompanyService } from './../../services/company.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[];
  isRefreshing: boolean = false;
  isFetchingOrders: boolean;
  isErrorFetchingOrders: boolean;

  tableColumns: string[];
  dataSource: MatTableDataSource<Order>;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute
  ) {    
    this.tableColumns = ['id', 'served', 'items', 'branch', 'date', 'action'];
    this.orders = JSON.parse(sessionStorage.getItem('orders'));
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

  viewOrder(orderId: string) {
    this.router.navigate(['./', orderId], { relativeTo: this.route })
  }

  refreshOrders() {
    this.isRefreshing = true;
    this.fetchOrders();
  }

  fetchOrders() {
    if (this.staffService.staff.staffBranch) {
      this.fetchBranchOrders();
    } else {
      this.fetchCompanyOrders();
    }
  }

  fetchBranchOrders() {
    if (!this.isRefreshing) {
      this.isFetchingOrders = true;
    }

    this.isErrorFetchingOrders = false;

    this.staffService.fetchBranchOrders(this.staffService.staff.staffBranch.branch.id)
    .subscribe(orders => {
      this.isRefreshing = false;
      this.isFetchingOrders = false;

      this.orders = orders.map(order => {
        order.id = order.id.substr(-1, 5);
        order.simpleDate = new Date(order.createdAt).toDateString();

        return order;
      });

      this.setupPaginator();

      sessionStorage.setItem('orders', JSON.stringify(orders));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingOrders = false;
      this.isErrorFetchingOrders = true;
    });
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
        order.maskedId = order.id.substring(order.id.lastIndexOf('-'), 5);
        order.simpleDate = new Date(order.createdAt).toDateString();

        return order;
      });

      this.setupPaginator();

      sessionStorage.setItem('orders', JSON.stringify(orders));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingOrders = false;
      this.isErrorFetchingOrders = true;
    });
  }

}
