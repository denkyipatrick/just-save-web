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
  isFetchingProducts: boolean;
  isErrorFetchingProducts: boolean;

  isShowMultipleBranches: boolean;
  canStaffCreateProduct: boolean;

  tableColumns: string[];
  dataSource: MatTableDataSource<Product>;

  @Output() productSelected: EventEmitter<Product>

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private staffService: StaffService,
    private companyService: CompanyService,
    private router: Router, private route: ActivatedRoute) {

    this.products = JSON.parse(sessionStorage.getItem('products'));
    this.isShowMultipleBranches = JSON.parse(localStorage.getItem('show-products-from-all-branches'));

    this.canStaffCreateProduct = this.staffService.staff.roles
      .find(role => role.id === 'add-product') ? true : false;

    this.tableColumns = ['key', 'name', 'sellingPrice', 'quantity', 'actions'];
    this.dataSource = new MatTableDataSource(this.products);
    this.productSelected = new EventEmitter();
  }

  ngOnInit(): void {
    // if (!this.products?.length) {
    // } else {
    //   this.dataSource = new MatTableDataSource(this.products);

    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;
    // }
    
    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  viewProduct(row: Product): void {
    this.router.navigate(['./', row.id], { relativeTo: this.route });
  }

  searchProduct(query: string): void {
    this.dataSource.filter = query;
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
    this.isFetchingProducts = true;
    this.isErrorFetchingProducts = false;

    this.companyService.fetchBranchProducts(this.staffService.branchId)
    .subscribe(products => {
      this.isFetchingProducts = false;

      this.products = products;
      this.dataSource = new MatTableDataSource(products);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      sessionStorage.setItem('products', JSON.stringify(products));
    }, error => {
      this.isFetchingProducts = false;
      this.isErrorFetchingProducts = true;
    });
  }

  fetchCompanyProducts(): void {
    this.isFetchingProducts = true;
    this.isErrorFetchingProducts = false;

    this.companyService.fetchCompanyProducts()
    .subscribe(products => {
      this.isFetchingProducts = false;

      this.products = products;
      this.dataSource = new MatTableDataSource(products);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      sessionStorage.setItem('products', JSON.stringify(products));
    }, error => {
      this.isFetchingProducts = false;
      this.isErrorFetchingProducts = true;
    });
  }

  deleteProduct(product: Product, event: Event): void {
    event.stopPropagation();
  }

}
