import { CompanyService } from './../../services/company.service';
import { StaffService } from './../../services/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './../../models/product';
import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: Product[] = [];

  searchKey: string;

  isRefreshing: boolean = false;
  isFetchingProducts: boolean;
  isErrorFetchingProducts: boolean;

  isShowMultipleBranches: boolean;
  canStaffCreateProduct: boolean;

  tableColumns: string[] = ['key', 'name', 'sellingPrice', 'quantity', 'actions'];
  dataSource: MatTableDataSource<Product>;

  @Output() productSelected: EventEmitter<Product>

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private staffService: StaffService,
    private companyService: CompanyService,
    private router: Router, private route: ActivatedRoute) {
    this.searchKey = sessionStorage.getItem('search-key');
    this.isShowMultipleBranches = JSON.parse(localStorage.getItem('show-products-from-all-branches'));

    this.canStaffCreateProduct = this.staffService.staff.roles
      .find(role => role.id === 'add-product') ? true : false;

    this.productSelected = new EventEmitter();
    
    this.products = JSON.parse(sessionStorage.getItem('products'));
  }

  ngOnInit(): void {
    if (this.products?.length) {
      this.setupPaginator();

      if (this.searchKey) {
        return this.searchProduct(this.searchKey);
      }

      this.refreshProducts();
      return;
    }
    
    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  refreshProducts() {
    this.isRefreshing = true;
    this.fetchProducts();
  }

  setupPaginator() {
    this.dataSource = new MatTableDataSource(this.products);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  viewProduct(row: Product): void {
    this.router.navigate(['./', row.id], { relativeTo: this.route });
  }

  searchProduct(query: string): void {
    this.dataSource.filter = query;
    sessionStorage.setItem('search-key', query);
  }

  clearSearchField(input: HTMLInputElement) {
    input.value = "";
    this.searchKey = "";
    this.searchProduct('');
    sessionStorage.removeItem('search-key');
  }

  toggleShowMultipleBranches(): void {
    this.isShowMultipleBranches = !this.isShowMultipleBranches;
    this.fetchProducts();

    localStorage.setItem('show-products-from-all-branches',
      JSON.stringify(this.isShowMultipleBranches));
  }

  fetchProducts(): void {
    if (this.isShowMultipleBranches) {
      this.fetchCompanyProducts();
    } else {
      this.fetchBranchProducts();
    }
  }

  fetchBranchProducts(): void {
    if (!this.isRefreshing) {
      this.isFetchingProducts = true;
    }

    this.isErrorFetchingProducts = false;

    this.companyService.fetchBranchProducts(this.staffService.branchId)
    .subscribe(products => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;

      this.products = products;
      this.setupPaginator();
      sessionStorage.setItem('products', JSON.stringify(products));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;
      this.isErrorFetchingProducts = true;
    });
  }

  fetchCompanyProducts(): void {
    if (!this.isRefreshing) {
      this.isFetchingProducts = true;
    }

    this.isErrorFetchingProducts = false;

    this.companyService.fetchCompanyProducts()
    .subscribe(products => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;

      this.products = products;
      this.setupPaginator();
      this.dataSource.paginator = this.paginator;
      sessionStorage.setItem('products', JSON.stringify(products));
    }, error => {
      this.isRefreshing = false;
      this.isFetchingProducts = false;
      this.isErrorFetchingProducts = true;
    });
  }

  deleteProduct(product: Product, event: Event): void {
    event.stopPropagation();
  }

}
