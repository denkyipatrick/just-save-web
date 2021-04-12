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
  tableColumns: string[];
  dataSource: MatTableDataSource<Order>;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private companyService: CompanyService,
    private router: Router,
    private route: ActivatedRoute
  ) {    
    this.tableColumns = ['id', 'date'];
  }

  ngOnInit(): void {
    this.fetchCompanyOrders();
  }
  
  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  viewOrder(orderId: string) {
    this.router.navigate(['./', orderId], { relativeTo: this.route })
  }

  fetchCompanyOrders() {
    this.companyService.fetchOrders()
    .subscribe(orders => {
      console.log(orders);
      this.orders = orders.map(order => {
        order.simpleDate = new Date(order.createdAt).toDateString();

        return order;
      });



      this.dataSource = new MatTableDataSource(orders);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

}
