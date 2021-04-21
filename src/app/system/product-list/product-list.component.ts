import { StaffService } from './../../services/staff.service';
import { CompanyService } from './../../services/company.service';
import { Product } from './../../models/product';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[];
  isFetchingProducts: boolean;
  isErrorFetchingProducts: boolean;

  canStaffCreateProduct: boolean;
  isShowMultipleBranches: boolean;
  
  @Input() showActionButtons: boolean;
  @Input() canCreateProduct: boolean;

  tableColumns: string[];
  dataSource: MatTableDataSource<Product>;
  @Output() productSelected: EventEmitter<Product>;

  @Input() showTablePaginatorFirstLastButtons: boolean;
  @Input() tablePaginatorPageSizeOptions: number[] = [5, 25, 100];

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
    this.productSelected = new EventEmitter();
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  viewProduct(selectedProduct: Product): void {
    this.productSelected.emit(selectedProduct);
    // this.router.navigate(['./', selectedProduct.id], { relativeTo: this.route });
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
    // if (this.isShowMultipleBranches) {
      this.fetchCompanyProducts();
    // } else {
      // this.fetchBranchProducts();
    // }
  }
  
  refreshProducts() {
    this.fetchProducts();
  }

  onEditProductQuantity(itemId: string) {
    this.viewProduct(this.products.find(product => product.id === itemId));
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
      console.log(products);
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
