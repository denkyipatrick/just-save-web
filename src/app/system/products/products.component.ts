import { CompanyService } from './../../services/company.service';
import { StaffService } from './../../services/staff.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './../../models/product';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: Product[];
  isFetchingProducts: boolean;
  isErrorFetchingProducts: boolean;

  isShowMultipleBranches: boolean;
  canStaffCreateProduct: boolean;

  tableColumns: string[];
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private staffService: StaffService,
    private companyService: CompanyService,
    private router: Router, private route: ActivatedRoute) {
    this.isShowMultipleBranches = JSON.parse(localStorage.getItem('show-products-from-all-branches'));

    this.canStaffCreateProduct = this.staffService.staff.roles
      .find(role => role.id === 'add-product') ? true : false;

    this.tableColumns = ['key', 'name', 'sellingPrice', 'quantity', 'actions'];
    this.dataSource = new MatTableDataSource(this.products);
  }

  ngOnInit(): void {
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
    this.companyService.fetchBranchProducts(this.staffService.branchId)
    .subscribe(products => {
      this.products = products;
      this.dataSource = new MatTableDataSource(products);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  fetchCompanyProducts(): void {
    this.companyService.fetchCompanyProducts()
    .subscribe(products => {
      this.products = products;
      this.dataSource = new MatTableDataSource(products);

      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteProduct(product: Product, event: Event): void {
    event.stopPropagation();
  }

}
