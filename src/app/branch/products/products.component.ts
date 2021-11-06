import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { BranchService } from './../services/branch.service';
import { Product } from './../models/product';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[];

  constructor(
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Product List');
    this.fetchProducts();
  }

  productSelected(product: Product) {
    this.router.navigate(['.', product.id], { relativeTo: this.route });
  }

  fetchProducts() {
    this.branchService.fetchProducts()
    .subscribe(products => {
      this.products = products;
    }, error => {
      console.error(error);
    });
  }

}
