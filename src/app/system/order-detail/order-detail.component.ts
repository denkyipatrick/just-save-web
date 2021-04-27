import { StaffService } from './../../services/staff.service';
import { Order } from './../../models/order';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order;
  orderId: string;
  orderAmount: number;
  orderDateString: string;
  tableColumns: string[];

  constructor(
    private staffService: StaffService, 
    private route: ActivatedRoute) {
      this.orderAmount = 0;
      this.tableColumns = ['name', 'itemPrice', 'quantity', 'totalItemAmount'];
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];

      this.fetchOrder();
    });
  }

  fetchOrder() {
    this.staffService.fetchOrderDetail(this.orderId)
    .subscribe(order => {
      this.order = order;

      const orderDate = new Date(this.order?.createdAt);
      this.orderDateString = `${orderDate.toDateString()} ` + 
      `${orderDate.getHours().toString().padStart(2, '0')}:` + 
      `${orderDate.getMinutes().toString().padStart(2, '0')}:` + 
      `${orderDate.getSeconds().toString().padStart(2, '0')} (24HR Time)`;

      this.order?.items.forEach(item => {
        this.orderAmount += item.salePrice > 0 ? 
          item.quantityOrdered * item.salePrice :
          item.quantityOrdered * item.orderItemSellingPrice
      });
    }, error => {
      console.log(error);
    });
  }

}
