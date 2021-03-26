import { Product } from './../../models/product';
import { StaffService } from './../../services/staff.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  productIdParam: string;

  constructor(private staffService: StaffService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productIdParam = params['id']
    });

    this.fetchProduct();
  }

  fetchProduct() {
    this.staffService.fetchProduct(this.productIdParam)
    .subscribe(product => {
      console.log(product)
      this.product = product;
    }, error => {
      console.log(error);
    });
  }

}
