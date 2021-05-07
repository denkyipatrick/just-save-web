import { Company } from './../../models/company';
import { CompanyService } from './../../services/company.service';
import { Order } from './../../models/order';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-receipt-dialog',
  templateUrl: './order-receipt-dialog.component.html',
  styleUrls: ['./order-receipt-dialog.component.scss']
})
export class OrderReceiptDialogComponent implements OnInit {
  order: Order;
  company: Company;
  orderAmount: number = 0;

  constructor(
    private companyService: CompanyService,
    private dialogRef: MatDialogRef<OrderReceiptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.company = this.companyService.company;
  }

  ngOnInit(): void {
    this.order = this.data.order;

    this.order?.items.forEach(item => {
      this.orderAmount += item.salePrice > 0 ?
        item.quantityOrdered * item.salePrice :
        item.quantityOrdered * item.orderItemSellingPrice
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  printReceipt() {
    window.print();
  }

}
